import { ApplicationError } from "../../error-handler/applicationError.js";
import databaseError from "../../error-handler/databaseError.js";
import { PostModel } from "../post/post.schema.js";
import { CommentModel } from "./comment.schema.js";
import { ObjectId } from "mongodb";

export default class CommentRepository {

    //get comment for a specific post
    async get(postID) {
        try {
            //find post by id
            const post = await PostModel.findById(postID);
            //throw error if post dosen't exist
            if (!post) {
                throw new ApplicationError("No post found for this postID", 404)
            }

            //find comment from commentmodel and then populate the data
            const comments = await CommentModel.find({
                post: new ObjectId(postID)
            }).populate({
                path: 'user',
                select: '_id name email'
            });

            //return the retrieved comments
            return comments;
        } catch (err) {
            //pass the unhandled database err
            databaseError(err);
        }
    }

    //add comment to a specific post
    async add(userID, postID, comment) {
        try {
            //find post by id
            const post = await PostModel.findById(postID);
            //throw error if post dosen't exist
            if (!post) {
                throw new ApplicationError("No post found for this postID", 404);
            }

            //create a new comment model to add a new comment
            const newComment = new CommentModel({
                user: new ObjectId(userID),
                post: new ObjectId(postID),
                comment: comment
            });

            const savedComment = await newComment.save();   //save the new comment
            post.comments.push(savedComment);   //push the saved comment into post
            await post.save();  //save the post

            //return the saved comment
            return savedComment.populate({ path: 'user', select: "_id name email" });
        } catch (err) {
            //pass the unhandled database err
            databaseError(err);
        }
    }

    //delete a specific comment
    async delete(commentID, userID) {
        try {
            //find a comment by its id
            const comment = await CommentModel.findById(commentID);
            //throw error if comment dosen't exist
            if (!comment) {
                throw new ApplicationError("No comment found for this commentID", 404)
            }

            //verify the user
            if (String(comment.user) !== userID) {
                throw new ApplicationError("You are not allowed to delete this comment", 400)
            }

            //update the comment details from post model
            await PostModel.updateOne(
                { _id: comment.post },
                { $pull: { comments: commentID } }
            );

            //delete the comment
            const result = await CommentModel.findByIdAndDelete(commentID);
            return result;  //return the deleted comment
        } catch (err) {
            //pass the unhandled database err
            databaseError(err);
        }
    }

    //update a specific comment
    async update(commentID, userID, updateComment) {
        try {
            //find a comment by its id
            const commentToUpdate = await CommentModel.findById(commentID);
            //throw error if comment dosen't exist
            if (!commentToUpdate) {
                throw new ApplicationError("No comment found for this commentID", 404);
            }

            //verify the user
            if (String(commentToUpdate.user) !== userID) {
                throw new ApplicationError("You are not allowed to delete this comment", 400)
            }

            commentToUpdate.comment = updateComment;    //update the comment with the new comment
            const updatedComment = await commentToUpdate.save();    //save the updated comment

            //return the updated comment and populate it
            return updatedComment.populate(
                { path: 'user', select: '_id name email' }
            );
        } catch (err) {
            //pass the unhandled database err
            databaseError(err);
        }
    }
}