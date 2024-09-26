import { ApplicationError } from "../../error-handler/applicationError.js";
import databaseError from "../../error-handler/databaseError.js";
import { UserModel } from "./user.schema.js";

export default class UserRepository {

    //user signup
    async signUp(user) {
        try {
            const newUser = new UserModel(user);
            const savedUser = await newUser.save();

            if (user.avatar) {
                savedUser.avatar = user.avatar;
                await savedUser.save()
            }

            const userWithoutPassword = { ...savedUser.toObject() };
            delete userWithoutPassword.password;
            return userWithoutPassword;
        } catch (err) {
            databaseError(err);
        }
    }

    //find user by email
    async findByEmail(email) {
        try {
            // const user = await UserModel.findOne({ email }).select("-password -token").populate("posts");
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new ApplicationError("No user found for this email.", 404);
            }
            return user;
        } catch (err) {
            databaseError(err);
        }
    }

    //log out the currently logged in user
    async logout(userID, token) {
        try {
            const user = await UserModel.findById(userID);

            if (!user) {
                throw new ApplicationError("No user found with this id", 404)
            }

            const tokenExists = user.tokens.includes(token);
            if (!tokenExists) {
                throw new ApplicationError("Token not found for this user", 400);
            }

            user.tokens = user.tokens.filter((t) => t !== token);
            await user.save();
            return { message: "Successfully logged out" }
        } catch (err) {
            databaseError(err);
        }
    }

    //logout of all the devices
    async logoutAllDevices(userID) {
        try {
            const user = await UserModel.findById(userID);

            if (!user) {
                throw new ApplicationError("User not found", 404);
            }

            user.tokens = [];
            await user.save();
            return { message: "Successfully logged out of all devices" };
        } catch (err) {
            databaseError(err);
        }
    }

    //find user by id
    async findById(id) {
        try {
            const user = await UserModel.findById(id).select("-password -token");
            if (!user) {
                throw new ApplicationError("No user found with this id", 404);
            }

            if (user.posts && user.posts.length > 0) {
                await user.populate("posts")
            }

            return user;
        } catch (err) {
            databaseError(err);
        }
    }

    // find all the users
    async findAll() {
        try {
            const users = await UserModel.find({}, { password: 0, token: 0 });
            if (users.length === 0) {
                throw new ApplicationError("There are no users.", 404);
            }

            if (users.posts && users.posts.length > 0) {
                await users.populate("posts")
            }

            return users;
        } catch (err) {
            databaseError(err);
        }
    }

    //update user by id
    async updateById(id, user) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(id, user, { new: true }).select("-password -tokens");

            if (!updatedUser) {
                throw new ApplicationError("No user with this id", 404);
            }

            if (updatedUser.posts && updatedUser.posts.length > 0) {
                await updatedUser.populate("posts")
            }

            if (user.avatar) {
                updatedUser.avatar = user.avatar;
                await updatedUser.save();
            }

            return updatedUser;
        } catch (err) {
            databaseError(err);
        }
    }
}