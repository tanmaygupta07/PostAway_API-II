import CommentRepository from "./comment.repository.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CommentController {
    constructor() {
        this.commentRepository = new CommentRepository();
    }

    //get comment for a specific post
    async get(req, res, next) {
        try {
            //retrieve postID from params
            const { postID } = req.params;
            //throw error if postID dosen't exist
            if (!postID) {
                throw new ApplicationError("Please enter postID to continue", 400);
            }

            //pass the postID to "get" function of comment repository and store the returned data
            const comments = await this.commentRepository.get(postID);
            //throw error if comments dosen't exist or not found
            if (!comments || comments.length === 0) {
                throw new ApplicationError("No comments found for this post", 404);
            }

            //return the retrieved comment as a response to the user
            return res.status(200).json({ success: true, comments: comments });
        } catch (err) {
            //pass the unhandled error to the error handler middleware
            next(err);
        }
    }

    //add comment to a specific post
    async add(req, res, next) {
        try {
            const { postID } = req.params;  //retrieve postID from params
            const userID = req.userID;      //retrieve userID from payload
            const { comment } = req.body;   //retrieve comment from body

            //throw an error if postID is not there
            if (!postID) {
                throw new ApplicationError("Please enter postID to continue", 400);
            }

            //throw an error if userID is not there
            if (!userID) {
                throw new ApplicationError("Please login to continue", 400);
            }

            //throw an error if comment is not there
            if (!comment) {
                throw new ApplicationError("Please enter a comment to post", 400);
            }

            //pass the data to "add" function of comment repository and store the returned data
            const newComment = await this.commentRepository.add(userID, postID, comment);
            //throw an error if no newComment is found
            if (!newComment) {
                throw new ApplicationError("An error occured while posting the comment", 400)
            }

            //return the new comment as a response to the user
            return res.status(200).json({ success: true, message: "New comment added succesfully", newComment: newComment });
        } catch (err) {
            //pass the unhandled error to the error handler middleware
            next(err);
        }
    }

    //delete a specific comment
    async delete(req, res, next) {
        try {
            const { commentID } = req.params;   //retrieve commentID from params
            const userID = req.userID;          //retrieve userID from payload

            //throw an error if commentID is not there
            if (!commentID) {
                throw new ApplicationError("Please enter commentID to continue", 400);
            }

            //throw an error if userID is not there
            if (!userID) {
                throw new ApplicationError("Please login to continue", 400);
            }

            //pass the data to "delete" function of comment repository and store the returned data
            const deletedComment = await this.commentRepository.delete(commentID, userID);
            //throw an error if "not deletedComment" returns true
            if (!deletedComment) {
                throw new ApplicationError("An error occured while deleting the comment", 400)
            }

            //return the deleted comment as a response to the user
            return res.status(200).json({ success: true, message: "Comment deleted successfully", deletedComment: deletedComment });
        } catch (err) {
            //pass the unhandled error to the error handler middleware
            next(err);
        }

    }

    //update a specific comment
    async update(req, res, next) {
        try {
            const { commentID } = req.params;   //retrieve commentID from params
            const userID = req.userID;          //retrieve userID from payload
            const { comment } = req.body;       //retrieve comment from body

            //throw an error if commentID is not there
            if (!commentID) {
                throw new ApplicationError("Please enter commentID to continue", 400);
            }

            //throw an error if userID is not there
            if (!userID) {
                throw new ApplicationError("Please login to continue", 400);
            }

            //throw an error if comment is not there
            if (!comment) {
                throw new ApplicationError("Please enter a comment to update", 400);
            }

            //pass the data to "delete" function of comment repository and store the returned data
            const updatedComment = await this.commentRepository.update(commentID, userID, comment);
            //throw an error if "not updatedComment" returns true
            if (!updatedComment) {
                throw new ApplicationError("An error occured while updating the comment", 400)
            }

            //return the updated comment as a response to the user
            return res.status(200).json({ success: true, message: "Comment updated successfully", updatedComment: updatedComment });
        } catch (err) {
            //pass the unhandled error to the error handler middleware
            next(err);
        }
    }
}