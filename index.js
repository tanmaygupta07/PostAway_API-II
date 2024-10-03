import express from 'express';
import dotenv from 'dotenv';
import { apiNotFound, errorHandlerMiddleware } from './src/middleware/errorHandlerMiddleware.js';
import userRouter from './src/features/user/user.routes.js';
import postRouter from './src/features/post/post.routes.js';
import commentRouter from './src/features/comment/comment.routes.js';
import likeRouter from './src/features/like/like.routes.js';
import friendRouter from './src/features/friend/friend.routes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);
app.use('/api/friends', friendRouter);

app.use(errorHandlerMiddleware);
app.use(apiNotFound);

export default app;