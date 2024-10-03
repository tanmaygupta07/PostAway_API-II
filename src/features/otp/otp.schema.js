import mongoose from "mongoose"

//otp schema
const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
});

//otp model
export const OtpModel = new mongoose.model('OTP', otpSchema);