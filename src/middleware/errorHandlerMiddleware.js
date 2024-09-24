import mongoose from "mongoose";
import { ApplicationError } from "../error-handler/applicationError.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
    //log the error for debugging purpose
    console.log(err);

    //handle errors from custom ApplicationError
    if (err instanceof ApplicationError) {
        return res.status(err.code).send(err.message);
    }

    //handle errors from mongoose ValidationError
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(err.message);
    }

    // response for unhandled errors
    res.status(500).send("Something went wrong, please try again later!");
}


export const apiNotFound = (req, res) => {
    res.status(404).send("API not found!");
}