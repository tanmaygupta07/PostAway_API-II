import express from 'express';
import dotenv from 'dotenv';
import { apiNotFound, errorHandlerMiddleware } from './src/middleware/errorHandlerMiddleware.js';

dotenv.config();
const app = express();


app.use(errorHandlerMiddleware);
app.use(apiNotFound);

export default app;