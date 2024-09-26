import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    avatar: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        match: [/.+\@.+\../, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: [true, "Please enter your gender"],
        enum: ['Male', 'Female', 'Others']
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    tokens: {
        type: [String]
    }
});


export const UserModel = mongoose.model('User', userSchema);