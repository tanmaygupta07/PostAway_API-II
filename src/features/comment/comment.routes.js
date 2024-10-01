import express from 'express';
import CommentController from './comment.controller.js';
import jwtAuth from '../../middleware/jwt.Middleware.js';

const commentRouter = express.Router();
const commentController = new CommentController();

//get all the comments of a specific post
commentRouter.get('/:postID', (req, res, next) => {
    commentController.get(req, res, next);
});

//add new comment to a specific post
commentRouter.post('/:postID', jwtAuth, (req, res, next) => {
    commentController.add(req, res, next);
});

//delete a specific comment
commentRouter.delete('/:commentID', jwtAuth, (req, res, next) => {
    commentController.delete(req, res, next);
});

//update a specific comment
commentRouter.put('/:commentID', jwtAuth, (req, res, next) => {
    commentController.update(req, res, next);
});

export default commentRouter;