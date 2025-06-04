const express = require('express');
const { getAdminPost, getAllProfile, deletePost, deleteProfile } = require('../Controller/AdminController');
const adminRouter=express.Router();


adminRouter.get('/post',getAdminPost)
adminRouter.get('/profile',getAllProfile)
adminRouter.delete('/deletePost/:id',deletePost)
adminRouter.delete('/deletePost/:id',deletePost)
adminRouter.delete('/deleteProfile/:id', deleteProfile);

module.exports=adminRouter