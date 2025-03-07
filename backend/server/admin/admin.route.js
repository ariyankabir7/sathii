const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({ storage });

const AdminController = require("./admin.controller");

const AdminMiddleware = require("../middleware/admin.middleware");

//admin store
router.post("/signup", upload.single("image"), AdminController.store);

//admin login
router.post("/login", AdminController.login);

//get admin profile
router.get("/profile", AdminMiddleware, AdminController.getProfile);

//update admin password
router.put("/", AdminMiddleware, AdminController.updatePassword);

//update admin profile
router.patch("/", AdminMiddleware, AdminController.update);

//update admin Profile Image
router.patch("/updateImage", AdminMiddleware, upload.single("image"), AdminController.updateImage);

//send email
router.post("/sendEmail", AdminController.forgotPassword);

//change password
router.post("/setPassword/:adminId", AdminMiddleware, AdminController.setPassword);

module.exports = router;
