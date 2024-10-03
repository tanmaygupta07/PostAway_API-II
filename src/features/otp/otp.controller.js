import { ApplicationError } from "../../error-handler/applicationError.js";
import OtpRepository from "./otp.repository.js";

export default class OtpController {
    constructor() {
        this.otpRepository = new OtpRepository();
    }

    //send an otp for resetting password
    async sendOtp(req, res, next) {
        try {
            const { email } = req.body;     //get email from body
            //throw an error if email is not provided
            if (!email) {
                throw new ApplicationError("Please provide an email", 400);
            }

            //pass the data to "sendOtp" function of otp repository and store the returned data
            const result = await this.otpRepository.sendOtp(email);
            //throw an error if no result is returned
            if (!result) {
                throw new ApplicationError("An error occured while sending the OTP", 500);
            }

            //return the result as a response to the user
            return res.status(200).json({ success: true, message: `OTP successfully sent to ${email}` });
        } catch (err) {
            //pass the unhandled error to the error handler middleware
            next(err);
        }
    }

    //verify an otp
    async verifyOtp(req, res, next) {
        try {
            const { email, otp } = req.body;        //get email and otp from the body
            //throw an error if either email or otp or both are not provided
            if (!email || !otp) {
                throw new ApplicationError("Please provide both email and OTP.", 400);
            }

            //pass the data to "verifyOtp" function of otp repository and store the returned data
            const result = await this.otpRepository.verifyOtp(email, otp);
            //throw an error if no result is returned
            if (!result) {
                throw new ApplicationError("An error occured while verifying the OTP", 500);
            }

            //return the result as a response to the user
            return res.status(200).json({ succes: true, message: "OTP verified. Now you can reset your password" });
        } catch (err) {
            //pass the unhandled error to the error handler middleware
            next(err);
        }
    }

    //reset the user's password
    async resetPassword(req, res, next) {
        try {
            const { email, password } = req.body;       //get email and password from body
            //throw an error if either email or password or both are not provided
            if (!email || !password) {
                throw new ApplicationError("Please provide both email and password.", 400);
            }

            //pass the data to "resetPassword" function of otp repository and store the returned data
            const result = await this.otpRepository.resetPassword(email, password);
            //throw an error if no result is returned
            if (!result) {
                throw new ApplicationError("An error occured while resetting the password", 500);
            }

            //return the result as a response to the user
            return res.status(200).json({ success: true, message: "Password reset successful." })
        } catch (err) {
            //pass the unhandled error to the error handler middleware
            next(err);
        }
    }
}