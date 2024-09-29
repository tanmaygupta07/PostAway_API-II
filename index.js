import express from 'express';
import dotenv from 'dotenv';
import { apiNotFound, errorHandlerMiddleware } from './src/middleware/errorHandlerMiddleware.js';
import userRouter from './src/features/user/user.routes.js';
import postRouter from './src/features/post/post.routes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

app.use(errorHandlerMiddleware);
app.use(apiNotFound);

export default app;