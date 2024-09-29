import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ApplicationError } from "../../error-handler/applicationError.js";
import databaseError from "../../error-handler/databaseError.js";
import { UserModel } from "../user/user.schema.js";
import { PostModel } from "./post.schema.js";
// import image from '../../../'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class PostRepository {

    //get all posts from various users to compile a news feed
    async getAllPosts() {
        try {
            const posts = await PostModel.aggregate([
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'post',
                        as: 'comments'
                    }
                },
                {
                    $lookup: {
                        from: 'likes',
                        localField: '_id',
                        foreignField: 'likeable',
                        as: 'likes'
                    }
                },
                {
                    $addFields: {
                        commentsCount: { $size: '$comments' },
                        likesCount: { $size: '$likes' }
                    }
                },
                {
                    $unset: ['comments', 'likes']
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $project: {
                        'user.name': 1,
                        'user.email': 1,
                        'user._id': 1,
                        caption: 1,
                        imageUrl: 1,
                        createdAt: 1,
                        commentsCount: 1,
                        likesCount: 1
                    }
                }
            ]);

            if (posts.length === 0) {
                throw new ApplicationError("No posts found", 404);
            }

            return posts;
        } catch (err) {
            databaseError(err);
        }
    }

    //find a specific post by ID
    async getPostById(postID) {
        try {
            const post = await PostModel.findById(postID);
            if (!post) {
                throw new ApplicationError("No post found with this id", 404);
            }

            if (post.comments && post.comments.length > 0) {
                await post.populate("comments");
            }

            if (post.likes && post.likes.length > 0) {
                await post.populate("likes");
            }

            const postWithCounts = {
                ...post.toObject(),
                commentsCount: post.comments.length,
                likesCount: post.likes.length
            };

            return postWithCounts;
        } catch (err) {
            databaseError(err);
        }
    }

    //find all posts for a specific user
    async getPostByUser(userID) {
        try {
            const posts = await PostModel.find({ user: userID });

            if (posts.length === 0) {
                throw new ApplicationError("User has not posted anything.", 404);
            }

            const postWithCounts = posts.map(post => ({
                ...post.toObject(),
                commentsCount: post.comments.length,
                likesCount: post.likes.length
            }));

            return postWithCounts;
        } catch (err) {
            databaseError(err);
        }
    }

    //create a new post
    async createPost(userID, caption, image) {
        try {
            const newPost = new PostModel({
                user: userID,
                caption: caption,
                image: image
            });

            const savedPost = await newPost.save();

            const user = await UserModel.findById(userID);
            user.posts.push(newPost);
            await user.save();

            return savedPost;
        } catch (err) {
            databaseError(err);
        }
    }

    //delete a specific post
    async delete(postID, userID) {
        try {
            const post = await PostModel.findById(postID);
            if (!post) {
                throw new ApplicationError("No post found for this id", 404);
            }

            if (String(post.user) !== userID) {
                throw new ApplicationError("You are not allowed to delete this post.", 400);
            }

            //file path to the image being deleted
            const filePath = path.join(__dirname, '..', '..', '..', 'uploads', 'postImage', post.image);

            //check if the file exists and then delete it
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Delete the file
            }

            const result = await PostModel.findByIdAndDelete(postID);
            return result;
        } catch (err) {
            databaseError(err);
        }
    }

    //updating a specific post
    async update(postID, userID, updateData, newImage) {
        try {
            const post = await PostModel.findById(postID);
            if (!post) {
                throw new ApplicationError("No post found for this id", 404);
            }

            if (String(post.user) !== userID) {
                throw new ApplicationError("You are not allowed to update this post.", 400);
            }

            // Delete old image if a new image is provided
            if (newImage) {
                const oldImagePath = path.join(__dirname, '..', '..', '..', 'uploads', 'postImage', post.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete the old image file
                }
                // Update the image field in updateData
                updateData.image = newImage.filename;
            }

            const updatedPost = await PostModel.findByIdAndUpdate(postID, updateData, { new: true })
                .populate({
                    path: 'user',
                    select: '_id name email gender'
                })
            // .populate({
            //     path: 'comments',
            //     select: '-_id'
            // })
            // .populate({
            //     path: 'likes',
            //     select: '-_id'
            // });

            const postWithCounts = {
                ...updatedPost.toObject(),
                commentsCount: updatedPost.comments.length,
                likesCount: updatedPost.likes.length
            };

            return postWithCounts;
        } catch (err) {
            databaseError(err);
        }
    }
}