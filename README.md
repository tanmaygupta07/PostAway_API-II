
# PostAway API

PostAway is a powerful and flexible API designed for managing posts, comments, likes, friendships, and OTP-based password resets. The API supports authentication and various user interactions, making it ideal for social or blogging platforms.




## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
    - [Post Routes](#post-routes)
    - [Comment Routes](#comment-routes)
    - [Like Routes](#like-routes)
    - [Friendship Routes](#friendship-routes)
    - [OTP Password Reset Routes](#otp-password-reset-routes)
5. [Project Structure](#project-structure)
6. [Environment Variables](#environment-variables)


## Features

- User Authentication
- Posts & Comments Management
- Likes on Posts & Comments
- Friendship Management
- OTP-based Password Reset (with Nodemailer)


## Installation

To set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/postaway-api.git
   cd postaway-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables)).

4. **Start the server**:
   ```bash
   npm start
   ```


## Authentication

The API supports user authentication through JWT tokens. To authenticate, users must log in with their credentials to receive a token that can be used for accessing protected routes.


## API Endpoints

### User Routes

- `POST /api/users/signup`: Signup as a user.
- `POST /api/users/signi`: Signin as a user.
- `POSt /api/users/logout`: Logout.
- `POST /api/users/logout-all-devices`: Logout of all devices.
- `GET /api/users/get-details/:userID`: Retrieve details of a specific user.
- `GET /api/users/get-all-details`: Retrieve details of all the user.
- `PUT /api/users/update-details/:userID`: Update a specific user.

### Post Routes

- `GET /api/posts/all`: Retrieve all posts.
- `GET /api/posts/:postID`: Retrieve a specific post.
- `GET /api/posts/`: Retrieve all post by a specific user.
- `POST /api/posts/`: Create a new post.
- `DELETE /api/posts/:postID`: Delete a post.
- `PUT /api/posts/:postID`: Update a post.


### Comment Routes

- `GET /api/comments/:postID`: Get all comments for a specific post.
- `POST /api/comments/:postID`: Add a comment to a post.
- `DELETE /api/comments/:commentID`: Delete a comment.
- `PUT /api/comments/:commentID`: Update a comment.

### Like Routes

- `GET /api/likes/:id`: Get likes for a specific post or comment.
- `POST /api/likes/toggle/:id`: Toggle like of a post or comment.

### Friendship Routes

- `GET /api/friends/get-friends`: Retrieve a list of friends for the authenticated user.
- `GET /api/friends/get-pending-requests`: Retrieve pending friend requests.
- `POST /api/friends/toggle-friendship/:friendID`: Send or remove a friend request.
- `POST /api/friends/response-to-request/:friendID`: Accept or reject a friend request.

### OTP Password Reset Routes

- `POST /api/otp/send`: Send an OTP to a user's email for password reset.
- `POST /api/otp/verify`: Verify an OTP.
- `POST /api/otp/reset-password`: Reset a user's password after OTP verification.


## Project Structure

Here's an overview of the project structure:

```

├── src/
|   ├── config
│   │   └── mongooseConfig.js
|   ├── errorHandler/
|   |   ├── applicationError.js
│   │   └── databaseError.js
│   ├── features/
│   │   ├── comment/
│   │   │   ├── comment.controller.js
│   │   │   ├── comment.model.js
│   │   │   ├── comment.routes.js
│   │   │   └── comment.schema.js
│   │   ├── friend/
│   │   │   ├── friend.controller.js
│   │   │   ├── friend.model.js
│   │   │   ├── friend.routes.js
│   │   │   └── friend.schema.js
│   │   ├── like/
│   │   │   ├── like.controller.js
│   │   │   ├── like.model.js
│   │   │   ├── like.routes.js
│   │   │   └── like.schema.js
│   │   ├── otp/
│   │   │   ├── otp.controller.js
│   │   │   ├── otp.model.js
│   │   │   ├── otp.routes.js
│   │   │   └── otp.schema.js
│   │   ├── post/
│   │   │   ├── post.controller.js
│   │   │   ├── post.model.js
│   │   │   ├── post.routes.js
│   │   │   └── post.schema.js
│   │   └── user/
│   │       ├── user.controller.js
│   │       ├── user.model.js
│   │       ├── user.routes.js
│   │       └── user.schema.js
│   └── middleware/
│       ├── errorHandlerMiddleware.js
│       ├── fileUploadMiddleware.js
│       ├── jwt.middleware.js
│       └── mailSendMiddleware.js
├── uploads/
|   ├── avatar/
│   └── postImage/
├── .env
├── index.js
├── package.lock.json
├── package.json
├── README.md
└── server.js
```


## Environment Variables

To run this project, you'll need to set up the following environment variables in a `.env` file:

```plaintext
DB_URL=mongodb://localhost:27017/postaway
JWT_SECRET=your_jwt_secret
USER_EMAIL=your_email@gmail.com
USER_PASS=your_email_password_or_app_password
```

- **DB_URL**: The MongoDB connection string.
- **JWT_SECRET**: The secret key used for generating JWT tokens.
- **USER_EMAIL**: The email address used for sending OTPs (through Nodemailer).
- **USER_PASS**: The password or app-specific password for the email account.
