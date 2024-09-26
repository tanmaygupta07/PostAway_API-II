import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApplicationError } from "../../error-handler/applicationError.js";
import UserRepository from "./user.repository.js";

export default class UserController {
    //contructor to initialize userRepository to class object
    constructor() {
        this.userRepository = new UserRepository();
    }

    //register a new user
    async signUp(req, res, next) {
        try {
            //get all the data from body
            const { name, email, password, gender } = req.body;

            //throw error if any detail is not provided
            if (!name || !email || !password || !gender) {
                throw new ApplicationError("All fields are required: name, email, password, gender.", 400);
            }

            //password hashing for security
            const hashedPassword = await bcrypt.hash(password, 12);
            if (!hashedPassword) {
                throw new ApplicationError("There is an error while hashing the password", 400);
            }

            //creating user object
            const user = { name, email, password: hashedPassword, gender };

            //check if any file is provided
            if (req.file && req.file.filename) {
                user.avatar = req.file.filename;
            }

            //calling signup function from repository
            const newUser = await this.userRepository.signUp(user);
            if (!newUser) {
                throw new ApplicationError("Something went wrong, unable to add new user", 400);
            }

            //sending response
            return res.status(201).json({
                message: "New user added successfully",
                success: true,
                user: newUser
            });
        } catch (err) {
            //handle duplicate email error first
            if (err.code === 11000) {
                return next(new ApplicationError("This email is already in use.", 400));
            }

            //pass other errors to the error handling middleware
            return next(err);
        }
    }

    //login as a user
    async signIn(req, res, next) {
        try {
            //get email and password from body
            const { email, password } = req.body;

            //checking missing email and password
            if (!email || !password) {
                throw new ApplicationError("Email or Password missing", 400);
            }

            //find user by email
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new ApplicationError("No user found with this email.", 404);
            }

            //compare password with hashed password
            const passwordMatched = await bcrypt.compare(password, user.password);

            // generate jwt token if password is matched else throw error
            if (passwordMatched) {
                const token = jwt.sign(
                    { userID: user._id, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                //save the genrated token in tokens property of userSchema
                user.tokens = user.tokens.concat(token);
                await user.save();

                return res.status(200).send(token);
            }
            else {
                //invalid password
                throw new ApplicationError("Invalid Credentials", 400);
            }
        } catch (err) {
            //handled any unexpected error
            next(err);
        }
    }

    //logout the currently logged in user
    async logout(req, res, next) {
        try {
            //get token from the headers
            const token = req.headers.authorization.replace("Bearer ", "");

            //get userID from jwt token
            const userID = req.userID;

            //calling logout function from repository
            const result = await this.userRepository.logout(userID, token);

            //throw error if result is false
            if (!result) {
                throw new ApplicationError("An Error occured while logging you out", 400)
            }

            //return message and code
            return res.status(200).send(result.message);
        } catch (err) {
            next(err);
        }
    }

    //logout out the user from all the devices
    async logoutAllDevices(req, res, next) {
        try {
            const userID = req.userID;

            const result = await this.userRepository.logoutAllDevices(userID);
            if (!result) {
                throw new ApplicationError("An error occured while logging out of all device", 400);
            }

            return res.status(200).send(result.message)
        } catch (err) {
            next(err)
        }
    }

    //retrieving user by its id
    async findById(req, res, next) {
        try {
            const { userID } = req.params;
            if (!userID) {
                throw new ApplicationError("Please enter a user id", 400);
            }

            const user = await this.userRepository.findById(userID);
            if (!user) {
                throw new ApplicationError("No user found for this id", 404);
            }

            return res.status(200).json({ success: true, user: user });
        } catch (err) {
            next(err);
        }
    }

    //retrieve all the user details
    async findAll(req, res, next) {
        try {
            const users = await this.userRepository.findAll();
            if (users.length === 0) {
                throw new ApplicationError("There are no users", 400)
            }

            return res.status(200).json({ message: true, users: users });
        } catch (err) {
            next(err);
        }
    }

    //update a user deatils by its id
    async updateById(req, res, next) {
        try {
            const id = req.params.userID;
            const userID = req.userID;

            if (!id) {
                throw new ApplicationError("Please enter a user id", 400);
            }

            if (id !== userID) {
                throw new ApplicationError("You are not allowed to update the data for this user", 400);
            }

            const dataToUpdate = req.body;
            if (!dataToUpdate || Object.keys(dataToUpdate).length === 0) {
                throw new ApplicationError("Please enter user data to update", 400);
            }

            //update avatar if provided
            if (req.file && req.file.filename) {
                dataToUpdate.avatar = req.file.filename;
            }

            const updatedUser = await this.userRepository.updateById(id, dataToUpdate, userID);
            if (!updatedUser) {
                throw new ApplicationError("An error occured while updation details.", 400);
            }

            return res.status(200).json({ success: true, message: "Details updated successfully", updatedUser: updatedUser });
        } catch (err) {
            next(err);
        }
    }
}