const express = require('express');
const userrouter = express.Router();
const {registerUser,loginUser, getCurrentUser} = require('../Controller/UserController');
const validateTokenHeader = require('../Middleware/Validatetokenheader');

userrouter.post('/register', registerUser);
userrouter.post('/login', loginUser);
userrouter.post('/profile', validateTokenHeader,getCurrentUser);





module.exports = userrouter;