import express from "express";
import OtpController from "./otp.controller.js";

const otpRouter = express.Router();
const otpController = new OtpController();

//send an otp
otpRouter.post('/send', (req, res, next) => {
    otpController.sendOtp(req, res, next);
});

//verify an otp
otpRouter.post('/verify', (req, res, next) => {
    otpController.verifyOtp(req, res, next);
});

//reset the password
otpRouter.post('/reset-password', (req, res, next) => {
    otpController.resetPassword(req, res, next);
});

export default otpRouter;