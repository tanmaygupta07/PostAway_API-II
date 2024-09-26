import express from 'express';
import UserController from './user.controller.js';
import { upload } from '../../middleware/fileUploadMiddleware.js';
import jwtAuth from '../../middleware/jwt.Middleware.js';

const userRouter = express.Router();
const userController = new UserController();

//register a new user
userRouter.post('/signup', upload.single('avatar'), (req, res, next) => {
    userController.signUp(req, res, next);
});

//log in as a user
userRouter.post('/signin', (req, res, next) => {
    userController.signIn(req, res, next);
});

//logout of currently logged in devices for the user
userRouter.post('/logout', jwtAuth, (req, res, next) => {
    userController.logout(req, res, next);
});

//logout of all the logged in devices for the user
userRouter.post('/logout-all-devices', jwtAuth, (req, res, next) => {
    userController.logoutAllDevices(req, res, next);
});

//retrieve details of user by its id
userRouter.get('/get-details/:userID', (req, res, next) => {
    userController.findById(req, res, next);
});

//retrieve details of all the users
userRouter.get('/get-all-details', (req, res, next) => {
    userController.findAll(req, res, next);
});

//update details of user data
userRouter.put('/update-details/:userID', upload.single('avatar'), jwtAuth, (req, res, next) => {
    userController.updateById(req, res, next);
});

export default userRouter;