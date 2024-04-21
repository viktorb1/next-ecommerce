"use client";
import React from "react";
import Image from "next/image";
import { useCartStore } from "@/store";
import { formatPrice } from "@/util/priceFormat";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import cart from "@/public/cart.png";
import { motion, AnimatePresence } from "framer-motion";
import Checkout from "./Checkout";
import OrderConfirmed from "./OrderConfirmed";

const Cart = () => {
  const cartStore = useCartStore();

  const totalPrice = cartStore.cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);

  console.log(cartStore.isOpen);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        cartStore.toggleCart();
        cartStore.setCheckout("cart");
      }}
      className="fixed w-full h-screen left-0 top-0 bg-black/25"
    >
      <motion.div
        layout
        onClick={(e) => e.stopPropagation()}
        className="bg-white absolute right-0 top-0 md:w-[500px] w-full h-screen p-12 overflow-y-scroll text-gray-700"
      >
        {cartStore.onCheckout === "cart" && (
          <button
            onClick={() => {
              cartStore.toggleCart();
              cartStore.setCheckout("cart");
            }}
            className="text-sm font-bold pb-12"
          >
            Back to store 👈
          </button>
        )}

        {cartStore.onCheckout === "checkout" && (
          <button
            onClick={() => {
              cartStore.setCheckout("cart");
            }}
            className="text-sm font-bold pb-12"
          >
            Check your cart 👈
          </button>
        )}

        {/* <h1>Here's your shopping list</h1> */}
        {cartStore.onCheckout === "cart" && (
          <>
            {cartStore.cart.map((item) => (
              <motion.div layout className="flex py-4 gap-4" key={item.id}>
                <Image className="rounded-md h-24" src={item.image} alt={item.name} width={120} height={120} />
                <div>
                  <h2>{item.name}</h2>
                  <div className="flex gap-1">
                    <h2>Quantity: {item.quantity}</h2>
                    <button
                      className="text-lg"
                      onClick={() =>
                        cartStore.removeProduct({
                          id: item.id,
                          image: item.image,
                          name: item.name,
                          unit_amount: item.unit_amount,
                          quantity: item.quantity,
                        })
                      }
                    >
                      <IoRemoveCircle />
                    </button>
                    <button
                      className="text-lg"
                      onClick={() =>
                        cartStore.addProduct({
                          id: item.id,
                          image: item.image,
                          name: item.name,
                          unit_amount: item.unit_amount,
                          quantity: item.quantity,
                        })
                      }
                    >
                      <IoAddCircle />
                    </button>
                  </div>

                  <p className="text-sm">{item.unit_amount ? formatPrice(item.unit_amount) : ""}</p>
                </div>
              </motion.div>
            ))}
          </>
        )}

        {cartStore.cart.length > 0 && cartStore.onCheckout === "cart" && (
          <motion.div layout>
            <p>Total: {formatPrice(totalPrice)}</p>
            <button
              onClick={() => cartStore.setCheckout("checkout")}
              className="py-2 mt-3 bg-teal-700 w-full rounded-md text-white"
            >
              Checkout
            </button>
          </motion.div>
        )}
        {cartStore.onCheckout === "checkout" && <Checkout />}
        {cartStore.onCheckout === "success" && <OrderConfirmed />}
        <AnimatePresence>
          {!cartStore.cart.length && cartStore.onCheckout === "cart" && (
            <motion.div
              animate={{ scale: 1, rotateZ: 0, opacity: 0.75 }}
              initial={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
              exit={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
              className="flex flex-col items-center gap-12 text-2xl font-medium pt-56 opacity-75"
            >
              <h1>Uhh ohh.. it's empty 😭</h1>
              <Image src={cart} alt="empty cart" width={200} height={200} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Cart;
