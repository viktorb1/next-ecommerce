"use client";

import { motion } from "framer-motion";
// import { Player } from "@lottiefiles/react-lottie-player";
import order from "@/public/order.json";

import React from "react";

const OrderAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        Prepping your order
      </motion.h1>
      <Player autoplay loop src={order}></Player>
    </div>
  );
};

export default OrderAnimation;
