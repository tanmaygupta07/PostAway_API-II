import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";
import databaseError from "../../error-handler/databaseError.js";
import { CommentModel } from "../comment/comment.schema.js";
import { PostModel } from "../post/post.schema.js";
import { LikeModel } from "./like.schema.js";

export default class LikeRepository {
    //get likes for a specific post or comment
    async getLikes(id, type) {
        try {
            //ensure post or comments exists
            const likeableModel = type === 'Post' ? PostModel : CommentModel;
            const likeable = await likeableModel.findById(id);
            //throw an error is post/comment is not found
            if (!likeable) {
                throw new ApplicationError(`No ${type.toLowerCase()} found for this ID`, 404)
            }

            //find like from like model and then populate the data
            const likes = await LikeModel.find({ likeable: new ObjectId(id), onModel: type })
                .populate({ path: 'user', select: '_id name email' });

            //throw an error if no likes are found
            if (likes.length === 0) {
                throw new ApplicationError(`No one liked the ${type.toLowerCase()} yet`, 404);
            }

            //return the retrieved likes
            return likes;
        } catch (err) {
            //pass the unhandled database err
            databaseError(err);
        }
    }

    //toggle likes for a specific post or comment
    async toggleLikes(userID, id, type) {
        try {
            //ensure post or comments exists
            const likeableModel = type === 'Post' ? PostModel : CommentModel;
            const likeable = await likeableModel.findById(id);
            //throw an error is post/comment is not found
            if (!likeable) {
                throw new ApplicationError(`No ${type.toLowerCase()} found for this ID`, 404)
            }

            //check if the like already exists
            const existingLike = await LikeModel.findOne({
                user: new ObjectId(userID),
                likeable: new ObjectId(id),
                onModel: type
            });

            let message;
            if (existingLike) {
                //if like exists then remove it
                await LikeModel.findByIdAndDelete(existingLike._id);

                //remove from likeable's like array
                likeable.likes.pull(existingLike._id);
                await likeable.save();

                message = 'Like removed successfully'
            }
            else {
                //if no like exists then add a new like
                const newLike = new LikeModel({
                    user: new ObjectId(userID),
                    likeable: new ObjectId(id),
                    onModel: type
                });

                //save the new like and add it to the likeable's like array
                const liked = await newLike.save();
                likeable.likes.push(liked._id);
                await likeable.save();

                message = "Liked successfully"
            }

            return { message };
        } catch (err) {
            //pass the unhandled database err
            databaseError(err);
        }
    }
}