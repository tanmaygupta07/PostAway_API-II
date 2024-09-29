import mongoose from "mongoose";
import moment from 'moment';

const formatDate = (date) => {
    return moment(date).format("DD MMM YYYY hh:mm:ss A")
}

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String
    },
    caption: {
        type: String,
        required: true
    },
    postedAt: {
        type: String,
        default: () => formatDate(Date.now()),
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
});

export const PostModel = mongoose.model("Post", postSchema);