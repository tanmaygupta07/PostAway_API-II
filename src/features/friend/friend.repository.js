import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";
import databaseError from "../../error-handler/databaseError.js";
import { FriendModel } from "./friend.schema.js";

export default class FriendRepository {
    //get a user's friends
    async getFriends(userID) {
        try {
            //find friends from friendmodel and then populate the data
            const friends = await FriendModel.find({
                $or: [
                    { user: new ObjectId(userID), status: 'accepted' },
                    { friend: new ObjectId(userID), status: 'accepted' }
                ]
            }).populate("user", "name").populate("friend", "name");

            //return the retrieved friends
            return friends;
        } catch (err) {
            //pass the unhandled database err
            databaseError(err);
        }
    }

    //get pending friend requests
    async getPendingRequests(userID) {
        try {
            //find all the pending friend request and then populate the data
            const pendingRequests = await FriendModel.find({
                friend: new ObjectId(userID),
                status: 'pending'
            }).populate("user", "name");

            //return the retrieved pending requests
            return pendingRequests;
        } catch (err) {
            //pass the unhandled database err
            databaseError(err);
        }
    }

    //toggle friendship with another user
    async toggleFriendship(userID, friendID) {
        try {
            //throw an error if userID and friendID is same
            if (userID === friendID) {
                throw new ApplicationError("You cannot send a friend request to yourself.", 400);
            }

            //find an existing friend request
            const existingFriendship = await FriendModel.findOne({
                $or: [
                    { user: new ObjectId(userID), friend: new ObjectId(friendID) },
                    { user: new ObjectId(friendID), friend: new ObjectId(userID) }
                ]
            });

            // check if friendship exists
            if (existingFriendship) {
                //cancel the request if status is 'pending'
                if (existingFriendship.status === 'pending') {
                    await FriendModel.deleteOne({ _id: existingFriendship._id });
                    return { message: "Friend request cancelled successfully." };
                }
                //remove the friend if status is 'accepted'
                else if (existingFriendship.status === 'accepted') {
                    await FriendModel.deleteOne({ _id: existingFriendship._id });
                    return { message: "Friend removed successfully." }
                }
                //return a message if status is 'rejected'
                return { message: "This friend request was already rejected." };
            }
            else {
                //if no friendship exists then send a new one
                const newFriendship = new FriendModel({
                    user: new ObjectId(userID),
                    friend: new ObjectId(friendID),
                    status: 'pending'
                });
                // save the new friendship model
                await newFriendship.save();
                //return a message
                return { message: "Friend request sent succesfully." }
            }
        } catch (err) {
            //pass the unhandled database err
            databaseError(err);
        }
    }

    //accept or reject a friend request
    async respondToRequest(userID, friendID, response) {
        try {
            //find an existing friend request with status as 'pending'
            const friendship = await FriendModel.findOne({
                user: new ObjectId(friendID),
                friend: new ObjectId(userID),
                status: 'pending'
            });

            //throw an error if no friend request is found
            if (!friendship) {
                throw new ApplicationError("Friend request not found", 404);
            }

            //change status to 'accepted' if response is 'accept'
            if (response === 'accept') {
                friendship.status = 'accepted';
            }
            //change status to 'rejected' if response is 'reject'
            else if (response === 'reject') {
                friendship.status = 'rejected';
            }
            //throw an error if invalid response is provided
            else {
                throw new ApplicationError("Invalid response. Use 'accept' or 'reject'.", 400);
            }

            await friendship.save();    //save the new frienship
            return { message: `Friend request ${response}ed successfully.` }; //return the message
        } catch (err) {
            //pass the unhandled database err
            databaseError(err);
        }
    }
}