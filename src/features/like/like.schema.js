import moment from "moment";
import mongoose from "mongoose"

//change date-format
const formatDate = (date) => {
    return moment(date).format("DD MMM YYYY hh:mm:ss A")
}

//like schema
const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    },
    likedAt: {
        type: String,
        default: () => formatDate(Date.now()),
    }
});

//like model
export const LikeModel = new mongoose.model('Like', likeSchema);