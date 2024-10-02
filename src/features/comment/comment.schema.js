import moment from "moment";
import mongoose from "mongoose";

//change date-format
const formatDate = (date) => {
    return moment(date).format("DD MMM YYYY hh:mm:ss A")
}

//comment schema
const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Post"
    },
    comment: {
        type: String,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    createdAt: {
        type: String,
        default: () => formatDate(Date.now()),
    }
});

//comment model
export const CommentModel = new mongoose.model("Comment", commentSchema)