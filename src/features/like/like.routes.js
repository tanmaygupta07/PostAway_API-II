import express from 'express';
import LikeController from './like.controller.js';
import jwtAuth from '../../middleware/jwt.Middleware.js';

const likeRouter = express.Router();
const likeController = new LikeController();

//get all likes of a specific post or comment
likeRouter.get('/:id', (req, res, next) => {
    likeController.getLikes(req, res, next);
});

//toggle the like of a specific post or comment
likeRouter.post('/toggle/:id', jwtAuth, (req, res, next) => {
    likeController.toggleLikes(req, res, next);
});

export default likeRouter;