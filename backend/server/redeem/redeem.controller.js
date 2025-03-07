const Redeem = require("./redeem.model");
const User = require("../user/user.model");
const Wallet = require("../wallet/wallet.model");
const dayjs = require("dayjs");

//private key
const admin = require("../../util/privateKey");

//mongoose
const mongoose = require("mongoose");

// get redeem list [frontend]
exports.index = async (req, res) => {
  try {
    if (!req.query.type) {
      return res.status(200).json({ status: false, message: "Type is Required!" });
    }

    let redeem;
    if (req.query.type.trim() === "pending") {
      redeem = await Redeem.find({ status: 0 }).populate("userId", "name image country").sort({ createdAt: -1 });
    }

    if (req.query.type.trim() === "solved") {
      redeem = await Redeem.find({ status: 1 }).populate("userId", "name image country").sort({ createdAt: -1 });
    }

    if (req.query.type.trim() === "decline") {
      redeem = await Redeem.find({ status: 2 }).populate("userId", "name image country").sort({ createdAt: -1 });
    }

    if (!redeem) {
      return res.status(200).json({ status: false, message: "No data Found!" });
    }

    return res.status(200).json({ status: true, message: "Success!!", redeem });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// get user redeem list
exports.userRedeem = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.query.userId);

    const [user, redeem] = await Promise.all([
      User.findById(userId),

      Redeem.aggregate([
        {
          $match: { userId: { $eq: userId } },
        },
        {
          $project: {
            _id: 1,
            status: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", 1] }, then: "Accepted" },
                  { case: { $eq: ["$status", 2] }, then: "Declined" },
                ],
                default: "Pending",
              },
            },
            // status: 1,
            userId: 1,
            description: 1,
            rCoin: 1,
            paymentGateway: 1,
            date: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]),
    ]);

    if (!user) {
      return res.status(200).json({ status: false, message: "User does not Exist!" });
    }

    if (!redeem) {
      return res.status(200).json({ status: false, message: "Data not Found!" });
    }

    let now = dayjs();
    const redeemList = redeem.map((data) => ({
      ...data,
      time:
        now.diff(data.createdAt, "minute") <= 60 && now.diff(data.createdAt, "minute") >= 0
          ? now.diff(data.createdAt, "minute") + " minutes ago"
          : now.diff(data.createdAt, "hour") >= 24
          ? dayjs(data.createdAt).format("DD MMM, YYYY")
          : now.diff(data.createdAt, "hour") + " hour ago",
    }));

    return res.status(200).json({
      status: redeemList.length > 0 ? true : false,
      message: redeemList.length > 0 ? "Success!" : "No Data Found",
      redeem: redeemList.length > 0 ? redeemList : [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// create redeem request
exports.store = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.paymentGateway || !req.body.description || !req.body.rCoin) {
      return res.status(200).json({ status: false, message: "Invalid Details!!" });
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(200).json({ status: false, message: "User does not found!" });
    }

    if (Number(req.body.rCoin) > user.rCoin) {
      return res.status(200).json({ status: false, message: "Not Enough Coin for CaseOut." });
    }

    if (Number(req.body.rCoin) < global.settingJSON.minRcoinForCashOut) {
      return res.status(200).json({ status: false, message: "The amount of rCoin is below the minimum required for withdrawal." });
    }

    const redeem = new Redeem();
    redeem.userId = user._id;
    redeem.description = req.body.description.trim();
    redeem.rCoin = Number(req.body.rCoin);
    redeem.paymentGateway = req.body.paymentGateway;
    redeem.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    user.rCoin -= Number(req.body.rCoin);
    user.withdrawalRcoin += Number(req.body.rCoin);

    await Promise.all([user.save(), redeem.save()]);

    return res.status(200).json({ status: true, message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// accept or decline the redeem request
exports.update = async (req, res) => {
  try {
    const redeem = await Redeem.findById(req.params.redeemId);

    const user = await User.findById(redeem.userId);
    if (!user) {
      return res.status(200).json({ status: false, message: "User does not found." });
    }

    let payload;

    if (req.query.type === "accept") {
      if (redeem.status == 1) {
        return res.status(200).json({ status: false, message: "redeem request already accepted by the admin." });
      }

      if (redeem.status == 2) {
        return res.status(200).json({ status: false, message: "redeem request already declined by the admin." });
      }

      redeem.status = 1;

      user.withdrawalRcoin -= redeem.rCoin;

      const outgoing = new Wallet();
      outgoing.userId = user._id;
      outgoing.rCoin = redeem.rCoin;
      outgoing.type = 7;
      outgoing.isIncome = false;
      outgoing.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

      await Promise.all([user.save(), outgoing.save(), redeem.save()]);

      payload = {
        token: user.fcmToken,
        notification: {
          title: "Your redeem request has been accepted!",
          body: "Congratulations! Your redeem request has been processed successfully.",
        },
      };
    } else {
      if (redeem.status == 1) {
        return res.status(200).json({ status: false, message: "redeem request already accepted by the admin." });
      }

      if (redeem.status == 2) {
        return res.status(200).json({ status: false, message: "redeem request already declined by the admin." });
      }

      redeem.status = 2;

      if (user.withdrawalRcoin > 0) {
        user.withdrawalRcoin -= redeem.rCoin;
      }
      user.rCoin += redeem.rCoin;

      await Promise.all([user.save(), redeem.save()]);

      payload = {
        to: user.fcmToken,
        notification: {
          title: "Your redeem request is declined!",
          body: "We regret to inform you that your redeem request has been declined. Please contact support for more details.",
        },
      };
    }

    res.status(200).json({ status: true, message: "Success", redeem });

    if (user && !user.isBlock && user.fcmToken !== null) {
      const adminPromise = await admin;

      adminPromise
        .messaging()
        .send(payload)
        .then((response) => {
          console.log("Successfully sent with response: ", response);
        })
        .catch((error) => {
          console.log("Error sending message:      ", error);
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};
