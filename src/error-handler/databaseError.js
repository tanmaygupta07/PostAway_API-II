import mongoose from "mongoose";
import { ApplicationError } from "./applicationError.js";

const databaseError = (err) => {
    if (err instanceof mongoose.Error.ValidationError) {
        throw err;
    }
    else {
        throw new ApplicationError(err.message, err.code || 500)
    }
}

export default databaseError;