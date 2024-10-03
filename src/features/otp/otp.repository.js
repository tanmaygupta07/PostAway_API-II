import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import { ApplicationError } from "../../error-handler/applicationError.js";
import databaseError from "../../error-handler/databaseError.js";
import { UserModel } from "../user/user.schema.js";
import { OtpModel } from './otp.schema.js';
import sendMail from '../../middleware/mailSendMiddleware.js';

export default class OtpRepository {
    //send an otp for resetting password
    async sendOtp(email) {
        try {
            //find the user using the email
            const isUser = await UserModel.find({ email });
            //trhow an error if no user is found
            if (!isUser) {
                throw new ApplicationError("No user found for this email.", 404);
            }

            //generate and hash otp
            const otp = otpGenerator.generate(6, { digits: true });
            const hashedOtp = await bcrypt.hash(otp, 10);

            //create new otp model to add new otp
            const newOtp = new OtpModel({
                otp: hashedOtp,
                user: email
            });

            await newOtp.save();        //save the new otp

            //sending otp to the user on gmail
            sendMail(email, otp);
            return true;
        } catch (error) {
            //pass the unhandled database err
            databaseError(err);
        }
    }

    //verify an otp
    async verifyOtp(email, otp) {
        try {
            //find the user using the email
            const isUser = await UserModel.find({ email });
            //trhow an error if no user is found
            if (!isUser) {
                throw new ApplicationError("No user found for this email.", 404);
            }

            //check whether the otp exists or not in otp model
            const otpExists = await OtpModel.findOne({ user: email });
            //throw an error if no OTP exists
            if (!otpExists) {
                throw new ApplicationError("Invalid OTP.", 400)
            }

            //check if otp has expired
            const isOtpValid = await bcrypt.compare(otp, otpExists.otp);
            //throw an error if OTP is not valid
            if (!isOtpValid) {
                throw new ApplicationError("Invalid OTP.", 400);
            }

            return true;
        } catch (err) {
            //pass the unhandled database err
            databaseError(err);
        }
    }

    //reset the user's password
    async resetPassword(email, newPassword) {
        try {
            //hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            //find the user and update it password
            const updatedUser = await UserModel.findOneAndUpdate(
                { email },
                { password: hashedPassword },
                { new: true }
            );

            //throw an error if no user if found to update password
            if (!updatedUser) {
                throw new ApplicationError("User not found", 404)
            }

            return true;
        } catch (err) {
            //pass the unhandled database err
            databaseError(err);
        }
    }
}