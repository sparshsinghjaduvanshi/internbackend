import express from "express";
import {
  login,
  updateprofile,
  sendOtp,
  verifyOtp,
  addFriend,
  getFriends,
  removeFriend,
} from "../controllers/auth.js";

const routes = express.Router();

routes.post("/login", login);
routes.patch("/update/:id", updateprofile);
routes.post("/send-otp", sendOtp);
routes.post("/verify-otp", verifyOtp);
routes.post("/add-friend", addFriend);
routes.get("/friends/:userId", getFriends);
routes.delete("/remove-friend", removeFriend);
export default routes;
