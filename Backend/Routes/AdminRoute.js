const express = require('express');
const { getAdminPost, getAllProfile, deletePost, deleteProfile, adminLogin, editRole,EditPostAdmin,updateProfileAdmin,getAdminPostData, updatePostAdmin } = require('../Controller/AdminController');
const adminValidate = require('../Middleware/AdminValidatte');
const adminRouter=express.Router();


adminRouter.get('/post',getAdminPost)
adminRouter.get('/profile',getAllProfile)
adminRouter.delete('/deletePost/:id',deletePost)
adminRouter.delete('/deletePost/:id',deletePost)
adminRouter.delete('/deleteProfile/:id', deleteProfile);
adminRouter.post('/login',adminLogin);
adminRouter.put('/role',adminValidate,editRole)
adminRouter.put('/editPost/:postId',adminValidate,EditPostAdmin)
adminRouter.put('/editProfile/:id',adminValidate,EditPostAdmin)
adminRouter.get('/post/:id',adminValidate,getAdminPostData)

module.exports=adminRouter