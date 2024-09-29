import express from 'express';
import PostController from './post.controller.js';
import jwtAuth from '../../middleware/jwt.Middleware.js';
import { upload } from '../../middleware/fileUploadMiddleware.js';

const postRouter = express.Router();
const postController = new PostController();

postRouter.get('/all', (req, res, next) => {
    postController.getAllPosts(req, res, next);
})

postRouter.get('/:postID', (req, res, next) => {
    postController.getPostById(req, res, next);
});

postRouter.get('/', jwtAuth, (req, res, next) => {
    postController.getPostByUser(req, res, next);
});

postRouter.post('/', upload.single('image'), jwtAuth, (req, res, next) => {
    postController.createPost(req, res, next);
});

postRouter.delete('/:postID', jwtAuth, (req, res, next) => {
    postController.delete(req, res, next);
});

postRouter.put('/:postID', upload.single('image'), jwtAuth, (req, res, next) => {
    postController.update(req, res, next);
})

export default postRouter;