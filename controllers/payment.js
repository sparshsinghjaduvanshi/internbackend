import User from "../modals/Auth.js";
import { sendInvoiceEmail } from "../utils/sendMail.js";

export const activatePremium =
  async (req, res) => {

    try {
      const { userId, plan } = req.body;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.plan = plan;
      await user.save();

      const planPrices = {
        bronze: 10,
        silver: 50,
        gold: 100,
      };

      await sendInvoiceEmail({
        email: user.email,
        name: user.name,
        plan,
        amount: planPrices[plan],
      });

      return res.status(200).json({
        success: true,
        message: "Plan activated",
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };