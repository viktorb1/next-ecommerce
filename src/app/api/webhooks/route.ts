import Stripe from 'stripe'
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { buffer } from "micro"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const prisma = new PrismaClient()



export async function POST(request: Request) {
    const data = await request.json()
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(request.toString(), data.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET)
    } catch(err) {
        return NextResponse.json({error: err}, {status: 400})
    }
    console.log(data)

    switch (event.type) {
        case "payment_intent.created":
            const paymentIntent = event.data.object
            console.log("Payment intent was created")
            break
        case 'charge.captured':
          const charge: Stripe.Charge = event.data.object;
          
          if (typeof charge.payment_intent === "string") {
            const order = await prisma.order.update({
                where: {paymentIntentId: charge.payment_intent},
                data: {status: "complete"}
            })
          }

          console.log('Charge captured:', charge);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      NextResponse.json({received: true}, {status: 200})
  
}