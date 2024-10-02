import { ApplicationError } from "../../error-handler/applicationError.js";
import LikeRepository from "./like.repository.js";

export default class LikeController {
    constructor() {
        this.likeRepository = new LikeRepository();
    }

    //get likes for a specific post or comment
    async getLikes(req, res, next) {
        try {
            const { id } = req.params;
            const { type } = req.body;

            //check if 'id' is provided
            if (!id) {
                throw new ApplicationError("Please enter an 'id' to continue", 400);
            }

            //check whether provided type is either 'Post' or 'Comment'
            if (!['Post', 'Comment'].includes(type)) {
                throw new ApplicationError("Enter a valid type i.e. 'Post' or 'Comment'", 400);
            }

            //call repository function to get likes
            const likes = await this.likeRepository.getLikes(id, type);
            //throw an error if no likes were found
            if (!likes || likes.length === 0) {
                throw new ApplicationError(`No likes found for this ${type.toLowerCase()}`);
            }

            //return the retreived likes as a response
            return res.status(200).json({ success: true, message: `${type} likes retrieved successfully`, likes: likes });
        } catch (err) {
            //pass the unhandled error to the error handler middleware
            next(err);
        }
    }

    //toggle likes for a specific post or comment
    async toggleLikes(req, res, next) {
        try {
            const { id } = req.params;
            const userID = req.userID;
            const { type } = req.body;

            //check for userID
            if (!userID) {
                throw new ApplicationError("Please login to continue", 400)
            }

            //check if 'id' is provided
            if (!id) {
                throw new ApplicationError("Please enter an 'id' to continue", 400);
            }

            //check whether provided type is either 'Post' or 'Comment'
            if (!['Post', 'Comment'].includes(type)) {
                throw new ApplicationError("Enter a valid type i.e. 'Post' or 'Comment'", 400);
            }

            //call repository function to toggle like
            const result = await this.likeRepository.toggleLikes(userID, id, type);
            //throw an error if no there's no result
            if (!result) {
                throw new ApplicationError("An error occured while toggeling the like", 500)
            }

            //return success response
            return res.status(200).json({ success: true, message: result.message });
        } catch (err) {
            //pass the unhandled error to the error handler middleware
            next(err);
        }
    }
}