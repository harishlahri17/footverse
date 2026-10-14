const express = require("express");
const route = express.Router();
const { authMiddleware } = require("../middleware/auth-Middleware");


const { createUser, updateUser, verifyPassword, updatePassword, userProfile } = require("../controller/userController");
route.post("/add-user", createUser); // add user API

route.get("/user-profile", authMiddleware, userProfile);
route.put("/update-profile", authMiddleware, updateUser);
route.post("/verify-password", authMiddleware, verifyPassword);
route.put("/update-password", authMiddleware, updatePassword);


const { loginUser } = require("../controller/auth/userAuth");
route.post("/user-login", loginUser); // Login user API



module.exports = route;