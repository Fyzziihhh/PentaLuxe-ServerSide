import {
  createResponse,
  serverErrorResponse,
} from "../../helpers/responseHandler.js";
import Wallet from "../../models/wallet.model.js";

const getUserWallet = async (req, res) => {
    console.log("inside user Wallet")
  try {
    const wallet = await Wallet.findOne({ userID: req.user._id });

    if (!wallet) {
      return createResponse(res, 200, true, "Wallet Not Found", { wallet: [] });
    }
    // Return the wallet information
    return createResponse(
      res,
      200,
      true,
      "user Wallet retrieved Successfully",
      { balance: wallet.balance, transactions: wallet.transactions }
    );
  } catch (error) {
    console.error("Error retrieving wallet:", error);
    return serverErrorResponse(res);
  }
};


export {getUserWallet}