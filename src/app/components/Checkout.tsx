"use client";
import React from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCartStore } from "@/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import OrderConfirmed from "./OrderConfirmed";
import { RiListOrdered2 } from "react-icons/ri";
import OrderAnimation from "./OrderAnimation";
import { motion } from "framer-motion";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = () => {
  const cartStore = useCartStore();
  const router = useRouter();
  const [requestSent, setRequestSent] = useState(false);

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!requestSent) {
      setRequestSent(true);
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartStore.cart,
          payment_intent_id: cartStore.paymentIntent,
        }),
      })
        .then((res) => {
          if (res.status === 403) {
            return router.push("/api/auth/signin");
          }

          return res.json();
        })
        .then((data) => {
          console.log(data);
          setClientSecret(data.paymentIntent.client_secret); // client_secret lets you confirm a payment and complete transaction
          // should be generated and saved on the server so that a user wouldn't be able to complete a transaction for us
          cartStore.setPaymentIntent(data.paymentIntent.id);
        });
    }
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "flat", // default is stripe
      labels: "floating",
    },
  };

  return (
    <div>
      {!clientSecret && <OrderAnimation />}
      {clientSecret && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </motion.div>
      )}
    </div>
  );
};

export default Checkout;
