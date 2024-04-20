"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store";
import { useEffect } from "react";

const OrderConfirmed = () => {
  const cartStore = useCartStore();

  useEffect(() => {
    cartStore.setPaymentIntent("");
    cartStore.clearCart();
  }, []);

  return (
    <div>
      <motion.div
        className="flex items-center justify-center mt-12 mb-3"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="rounded-md text-center">
          <h1 className="text-2xl font-medium">Your order has been placed!</h1>
          <h2 className="mt-4">Check your email for the receipt</h2>
        </div>
      </motion.div>
      <div className="py-8 flex justify-center">
        <video width="320" height="240" loop preload="auto" autoplay="autoplay" muted>
          <source src="/dance.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="flex justify-center flex-col">
        <Link
          href={"/dashboard"}
          onClick={() => {
            setTimeout(() => {
              cartStore.setCheckout("cart");
            }, 1000);
            cartStore.toggleCart();
          }}
        >
          <button className="font-medium">Check your Order</button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmed;
