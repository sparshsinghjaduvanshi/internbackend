import dotenv from "dotenv";

dotenv.config();

import express from "express";
import Razorpay from "razorpay";
import { activatePremium } from "../controllers/payment.js";


const router = express.Router();
// console.log(process.env.RAZORPAY_KEY_ID);
// console.log(process.env.RAZORPAY_SECRET);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});



router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
});
router.post("/activate-premium",activatePremium);

export default router;