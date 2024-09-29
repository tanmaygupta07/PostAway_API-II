import { ApplicationError } from "../../error-handler/applicationError.js";
import databaseError from "../../error-handler/databaseError.js";
import PostRepository from "./post.repository.js";

export default class PostController {

    constructor() {
        this.postRepository = new PostRepository();
    }

    //get all posts from various users to compile a news feed
    async getAllPosts(req, res, next) {
        try {
            const posts = await this.postRepository.getAllPosts();
            return res.status(200).json({ success: true, posts: posts });
        } catch (err) {
            next(err);
        }
    }

    //get a specific post by id
    async getPostById(req, res, next) {
        try {
            const postID = req.params.postID;
            if (!postID) {
                throw new ApplicationError("Please enter postID to continue.", 400)
            }

            const post = await this.postRepository.getPostById(postID);
            return res.status(200).json({ success: true, post: post });
        } catch (err) {
            next(err);
        }
    }

    //get all the posts of a specific user
    async getPostByUser(req, res, next) {
        try {
            const userID = req.userID;
            if (!userID) {
                throw new ApplicationError("Please login to continue.", 400);
            }

            const posts = await this.postRepository.getPostByUser(userID);
            return res.status(200).json({ success: true, posts: posts });

        } catch (err) {
            next(err)
        }
    }

    //create a new post
    async createPost(req, res, next) {
        try {
            const caption = req.body.caption;
            const image = req.file.filename;

            if (!image) {
                throw new ApplicationError("Please provide image", 400);
            }

            const userID = req.userID;
            if (!userID) {
                throw new ApplicationError("Please login to continue.", 400);
            }

            const newPost = await this.postRepository.createPost(userID, caption, image);
            if (!newPost) {
                throw new ApplicationError("An error occured while creating the post.", 400);
            }

            return res.status(200).json({ success: true, post: newPost });
        } catch (err) {
            next(err);
        }
    }

    //delete a specific post
    async delete(req, res, next) {
        try {
            const postID = req.params.postID;
            const userID = req.userID;
            if (!postID) {
                throw new ApplicationError("Please enter postID to continue", 400);
            }

            const result = await this.postRepository.delete(postID, userID);
            if (!result) {
                throw new ApplicationError("An error occured while deleting the post");
            }

            return res.status(200).json({ success: true, message: "Post deleted successfully", deletedPost: result });
        } catch (err) {
            next(err);
        }
    }

    //upadte a specific post
    async update(req, res, next) {
        try {
            const postID = req.params.postID
            const caption = req.body.caption

            const updateData = {}
            if (caption) {
                updateData.caption = caption;
            }

            var newImage = null;
            if (req.file) {
                newImage = req.file;
            }

            if (!postID) {
                throw new ApplicationError("Please enter postID to continue.", 400)
            }

            const userID = req.userID;
            if (!userID) {
                throw new ApplicationError("Please login to continue", 400);
            }

            const updatedPost = await this.postRepository.update(postID, userID, updateData, newImage)
            if (!updatedPost) {
                throw new ApplicationError("An error occured while updating the post", 400);
            }

            return res.status(200).json({ success: true, message: "Post updated successfully", updatedPost });
        } catch (err) {
            next(err);
        }
    }
}