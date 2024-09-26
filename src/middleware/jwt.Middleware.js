import jwt from 'jsonwebtoken';
import { ApplicationError } from '../errorHandler/applicationError.js';

//middleware to authenticate the user by verifying the token
const jwtAuth = (req, res, next) => {
    const authHead = req.headers['authorization'];
    let token = authHead.split(' ')[1];

    if (!token) {
        throw new ApplicationError("Unauthorized", 401);
    }

    try {
        const payload = jwt.verify(
            token, process.env.JWT_SECRET
        );

        req.userID = payload.userID;
    } catch (err) {
        console.log(err);
        throw new ApplicationError("Invalid token | Unauthorized", 401)
    }
    next();
}

export default jwtAuth;