import express from "express";
import jwtAuth from "../../middleware/jwt.Middleware.js";
import FriendController from "./friend.controller.js";

const friendRouter = express.Router();
const friendController = new FriendController();

//get all the friend of a user 
friendRouter.get('/get-friends', jwtAuth, (req, res, next) => {
    friendController.getFriends(req, res, next);
});

//get all the pending friend requests
friendRouter.get('/get-pending-requests', jwtAuth, (req, res, next) => {
    friendController.getPendingRequests(req, res, next);
});

//toggle friendship with another user
friendRouter.post('/toggle-friendship/:friendID', jwtAuth, (req, res, next) => {
    friendController.toggleFriendship(req, res, next);
});

//accept or reject a friend request
friendRouter.post('/response-to-request/:friendID', jwtAuth, (req, res, next) => {
    friendController.respondToRequest(req, res, next);
});

export default friendRouter;