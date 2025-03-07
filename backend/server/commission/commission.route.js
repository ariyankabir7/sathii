const express = require("express");
const checkAccessWithKey = require("../../checkAccess");
const commissionController = require("./commission.controller");

const route = express.Router();

// store Commission
route.post("/", checkAccessWithKey(), commissionController.store);

// get all Commission for admin penal
route.get("/", checkAccessWithKey(), commissionController.getAllCommission);

// delete Commission
route.delete(
  "/:id",
  checkAccessWithKey(),
  commissionController.deleteCommission
);

// update Commission
route.patch(
  "/:id",
  checkAccessWithKey(),
  commissionController.updateCommission
);
module.exports = route;
