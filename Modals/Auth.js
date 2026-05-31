import mongoose from "mongoose";

const userschema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
  },

  channelname: {
    type: String,
  },

  description: {
    type: String,
  },

  image: {
    type: String,
  },

  joinedon: {
    type: Date,
    default: Date.now,
  },

  // NEW FIELDS

  phone: {
    type: String,
    default: "",
  },

  state: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },

  otp: {
    type: String,
    default: null,
  },

  otpExpires: {
    type: Date,
    default: null,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  otpAttempts: {
    type: Number,
    default: 0,
  },

  lastOtpRequest: {
    type: Date,
    default: null,
  },

  plan: {
    type: String,
    default: "free",
  },

  downloads: [
    {
      videoId: String,

      downloadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.models.User ||
  mongoose.model("User", userschema);