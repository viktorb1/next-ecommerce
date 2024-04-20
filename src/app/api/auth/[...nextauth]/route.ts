import NextAuth, {NextAuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import type { Adapter } from "next-auth/adapters"
import Stripe from 'stripe'
import type { User } from "next-auth"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  events: {
    createUser: async ({user}: { user: User}) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
      
      if (user.name && user.email) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name
        })

        await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            stripeCustomerId: customer.id
          }
        })
      }

    }
  },
  callbacks: {
    async session({session, token, user}) {
      session.user = user
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };
