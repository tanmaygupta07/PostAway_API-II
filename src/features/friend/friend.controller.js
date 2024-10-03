import { ApplicationError } from "../../error-handler/applicationError.js";
import FriendRepository from "./friend.repository.js";

export default class FriendController {
    constructor() {
        this.friendRepository = new FriendRepository();
    }

    //get a user's friends
    async getFriends(req, res, next) {
        try {
            const userID = req.userID;      //get userID from the payload

            //pass the data to "getFriends" function of friend repository and store the returned data
            const friends = await this.friendRepository.getFriends(userID);
            //throw an error if no friends are found
            if (!friends || friends.length === 0) {
                throw new ApplicationError("No friends found for the user.", 404)
            }

            //return the friends as a response to the user
            return res.status(200).json({ success: true, friends });
        } catch (err) {
            //pass the unhandled error to the error handler middleware
            next(err);
        }
    }

    //get pending friend requests
    async getPendingRequests(req, res, next) {
        try {
            const userID = req.userID;      //get userID from the payload

            //pass the data to "getPendingRequests" function of friend repository and store the returned data
            const pendingRequests = await this.friendRepository.getPendingRequests(userID);
            //throw an error if no pending requests are found
            if (!pendingRequests || pendingRequests.length === 0) {
                throw new ApplicationError("No pending friend request found.", 404)
            }

            //return the pending requests as a response to the user
            return res.status(200).json({ success: true, pendingRequests });
        } catch (err) {
            //pass the unhandled error to the error handler middleware
            next(err);
        }
    }

    //toggle friendship with another user
    async toggleFriendship(req, res, next) {
        try {
            const userID = req.userID;          //get userID from the payload
            const { friendID } = req.params;    //get friendID from the params

            //throw an error if friendID is not provided
            if (!friendID) {
                throw new ApplicationError("Please enter friendID to continue.", 400);
            }

            //pass the data to "toggleFriendship" function of friend repository and store the returned data
            const result = await this.friendRepository.toggleFriendship(userID, friendID);

            // return the result as a response to the user
            return res.status(200).json({ success: true, message: result.message });
        } catch (err) {
            //pass the unhandled error to the error handler middleware
            next(err);
        }
    }

    //accept or reject a friend request
    async respondToRequest(req, res, next) {
        try {
            const userID = req.userID;          //get userID from the payload
            const { friendID } = req.params;    //get friendID from the params
            const { response } = req.body;      //get reponse from the body

            //throw an error if friendID is not provided
            if (!friendID) {
                throw new ApplicationError("Please enter friendID to continue.", 400);
            }

            //throw an error if response is not provided
            if (!response) {
                throw new ApplicationError("Please enter response to continue.", 400);
            }

            //pass the data to "respondToRequest" function of friend repository and store the returned data
            const result = await this.friendRepository.respondToRequest(userID, friendID, response);

            // return the result as a response to the user
            return res.status(200).json({ success: true, message: result.message });
        } catch (err) {
            //pass the unhandled error to the error handler middleware
            next(err);
        }
    }
}