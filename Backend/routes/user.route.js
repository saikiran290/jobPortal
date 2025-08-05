import express from "express";

import {login, logout, register, updateProfile} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
const router = express.Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,updateProfile);
router.route("/me").get(isAuthenticated, (req, res) => {
  res.json({ 
    success: true, 
    message: "User is authenticated",
    userId: req.id 
  });
});


export default router;