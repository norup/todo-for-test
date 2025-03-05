const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const verifyToken = require("../middlewares/jwt.middleware");

// public router
router.post("/login", authController.login);
router.post("/register", authController.register);

// private router
router.post("/logout", verifyToken, authController.logout);
router.post("/refresh-token", verifyToken, authController.refreshToken);

module.exports = router;
