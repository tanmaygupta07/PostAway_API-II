import mongoose from "mongoose";

const url = process.env.DB_URL;

export const connectUsingMongoose = async () => {
    try {
        await mongoose.connect(url, {
            family: 4 // Forces IPv4, useful in certain network environments
        });
        console.log("MongoDB connected using Mongoose.");
    } catch (error) {
        console.log("Error while connecting to the DB");
        console.log(error);
    }
}