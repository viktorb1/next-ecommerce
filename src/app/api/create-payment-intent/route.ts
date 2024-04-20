import Stripe from 'stripe'
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from 'next-auth'
import { AddCartType } from '@/app/types/AddCartType';
import { Prisma } from "@prisma/client"
import { PrismaClient } from "@prisma/client"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const prisma = new PrismaClient()


// don't do this, this is hackable if a hacker uses burpsuite or something similar
const calculateOrderAmount = (items: AddCartType[]) => {
    const totalPrice = items.reduce((acc, item) => {
        return acc + item.unit_amount! * item.quantity!
    }, 0)
    return totalPrice
}


export async function POST(request: Request) {
    const data = await request.json()
    const userSession = await getServerSession(authOptions)

    if (!userSession?.user) {
        return NextResponse.json({
            message: "Not logged in"
        }, {status: 403})
    }
    console.log(data)
    const { items, payment_intent_id } = data

    const orderData = {
        user: {connect: {id: userSession.user?.id}},
        amount: calculateOrderAmount(items),
        currency: 'usd',
        status: 'pending',
        paymentIntentId: payment_intent_id,
        products: {
            create: items.map((item) => ({
                name: item.name,
                description: item.description || null,
                unit_amount: item.unit_amount,
                // unit_amount: parseFloat(item.unit_amount),
                image: item.image,
                quantity: item.quantity
            }))
        }
    }

    // if cliented passed in payment_intent_id, update stripe and prisma Order db with new values
    // otherwise create new values in stripe and prisma (this is initially the default to set a payment_intent_id)
    if (payment_intent_id) {
        const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id)
        if (current_intent) {
            const updated_intent = await stripe.paymentIntents.update(
                payment_intent_id,
                {amount: calculateOrderAmount(items)}
            )

            const existing_order = await prisma.order.findFirst({
                where: {paymentIntentId: updated_intent.id},
                include: {products: true}
            })

            if (!existing_order) {
                return NextResponse.json({
                    message: "Ivalid payment intent"
                }, {status: 403})
            }

            const updated_order = await prisma.order.update({
                where: {id: existing_order.id},
                data: {
                    amount: calculateOrderAmount(items),
                    products: {
                        deleteMany: {},
                        create: items.map((item) => ({
                            name: item.name,
                            description: item.description || null,
                            unit_amount: item.unit_amount,
                            image: item.image,
                            quantity: item.quantity
                        }))
                    }
                }
            })

            return NextResponse.json({
                paymentIntent: updated_intent
            }, {status: 200})
        }
    } else {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: "usd",
            automatic_payment_methods: {enabled: true}
        })
        orderData.paymentIntentId = paymentIntent.id
        const newOrder = await prisma.order.create({
            data: orderData
        })

        return NextResponse.json({
            paymentIntent
        })
    }
}