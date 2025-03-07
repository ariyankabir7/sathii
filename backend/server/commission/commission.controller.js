const Commission = require("./commission.model");

// add percentage and amount in project commission
exports.store = async (req, res) => {
  try {
    if (!req?.body?.amountPercentage || !req?.body?.upperAmount) {
      return res
        .status(200)
        .send({ status: false, message: "Invalid details" });
    }

    const commission = await Commission.create({
      upperAmount: req?.body?.upperAmount,
      amountPercentage: req?.body?.amountPercentage,
      lowerAmount: req?.body?.lowerAmount || null,
    });

    return res
      .status(200)
      .send({ status: true, message: "Success!!", commission });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// get all project commission in adminpenal
exports.getAllCommission = async (req, res) => {
  try {
    const commission = await Commission.find();

    return res
      .status(200)
      .send({ status: true, message: "success!!", commission });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// update project commission
exports.updateCommission = async (req, res) => {
  try {
    if (!req?.params?.id) {
      return res
        .status(200)
        .send({ status: false, message: "Invalid details" });
    }

    const commission = await Commission.findById(req?.params?.id);

    if (!commission) {
      return res.status(200).send({ status: false, message: "data not found" });
    }

    commission.amountPercentage =
      req?.body?.amountPercentage || commission.amountPercentage;
    commission.lowerAmount = req?.body?.lowerAmount || commission.lowerAmount;
    commission.upperAmount = req?.body?.upperAmount || commission.upperAmount;

    await commission.save();

    return res
      .status(200)
      .send({ status: true, message: "success!!", commission });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

// delete commission
exports.deleteCommission = async (req, res) => {
  try {
    if (!req?.params?.id) {
      return res
        .status(200)
        .send({ status: false, message: "Invalid details" });
    }
    const [commission, AllCommissions] = await Promise.all([
      Commission.findById(req?.params?.id),
      Commission.countDocuments(),
    ]);

    if (!commission) {
      return res.status(200).send({ status: false, message: "data not found" });
    }

    if (AllCommissions > 1) {
      await commission.deleteOne();
    } else {
      return res.status(200).send({
        status: false,
        message: "last one record cannot be deleted",
      });
    }

    return res.status(200).send({ status: true, message: "success!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};
