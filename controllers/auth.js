import mongoose from "mongoose";
import users from "../models/Auth.js";
import crypto from "crypto";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";
import { sendSMS } from "../utils/smsService.js";


export const login = async (req, res) => {
  const { email, name, image } = req.body;

  try {
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      const newUser = await users.create({ email, name, image });
      return res.status(201).json({ result: newUser });
    } else {
      return res.status(200).json({ result: existingUser });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description, phone, state, city } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(500).json({ message: "User unavailable..." });
  }
  try {
    const updatedata = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          channelname,
          description,
          phone,
          state,
          city
        },
      },
      { new: true }
    );
    return res.status(201).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404)
        .json({
          message:
            "User not found",
        });
    }

    // 30 sec cooldown

    if (
      user.lastOtpRequest &&
      Date.now() - new Date(user.lastOtpRequest).getTime() < 30000) {

      return res.status(429)
        .json({
          message:
            "Please wait before requesting another OTP",
        });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.lastOtpRequest =
      new Date();

    user.otpAttempts = 0;
    await user.save();
    const southStates = [
      "Tamil Nadu",
      "Kerala",
      "Karnataka",
      "Andhra Pradesh",
      "Telangana",
    ];
    if (
      southStates.includes(
        user.state
      )
    ) {
      await sendOtpEmail(
        user.email,
        otp
      );

    } else {

      await sendSMS(
        user.phone,
        otp
      );
    }
    return res.status(200)
      .json({
        success: true,
        message:
          "OTP sent successfully",
      });

  } catch (error) {
    console.log(error);
    return res.status(500)
      .json({
        message:
          "Server Error",
      });
  }
};

export const verifyOtp = async (req, res) => {

  try {

    const { userId, otp } = req.body;

    const user = await users.findById(userId);

    if (!user) {

      return res.status(404)
        .json({
          message:
            "User not found",
        });
    }

    if (user.otpAttempts >= 5) {

      return res.status(403)
        .json({
          message:
            "Too many attempts",
        });
    }

    if (!user.otpExpires || user.otpExpires < Date.now()) {

      return res.status(400)
        .json({
          message:
            "OTP expired",
        });
    }

    if (user.otp !== otp) {

      user.otpAttempts += 1;
      await user.save();

      return res.status(400)
        .json({
          message:
            "Invalid OTP",
        });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    await user.save();

    return res.status(200)
      .json({
        success: true,
        message:
          "OTP verified",
      });

  } catch (error) {
    console.log(error);
    return res.status(500)
      .json({
        message:
          "Server Error",
      });
  }
};
