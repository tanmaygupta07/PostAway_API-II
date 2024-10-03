import moment from "moment";
import mongoose from "mongoose";

//change date-format
const formatDate = (date) => {
    return moment(date).format("DD MMM YYYY hh:mm:ss A")
}

//friend schema
const friendSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    likedAt: {
        type: String,
        default: () => formatDate(Date.now())
    }
});

//friend model
export const FriendModel = new mongoose.model('Friend', friendSchema);