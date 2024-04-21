import Stripe from 'stripe'
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { Session, getServerSession } from "next-auth"
import { authOptions } from '../auth/[...nextauth]/route'

import prisma from '@/util/db'

export async function GET(request: Request | {} = {}) {
    const user = await getServerSession(authOptions)

    if (!user) {
        return NextResponse.json(null)
    }


    const orders = await prisma.order.findMany({
        where: {
            userId: user.user!.id,
        },
        include: {
            products: true
        }
    })

    return NextResponse.json(orders, {status: 200})
}