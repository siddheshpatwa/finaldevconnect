const express = require("express");
const profileRouter = express.Router();
// const upload = require("../Middleware/Multer");
const validateTokenHeader = require("../Middleware/Validatetokenheader");
const { createProfile,updateProfile,getProfile, searchProfiles, getPublicProfileAndPosts} = require("../Controller/ProfileController");
const { createPost,updatePost, getPost ,getPostData,viewPost, deletePost,likePost, getLikeCount, commentPost } = require("../Controller/PostController");
const upload = require("../Middleware/Multer");

profileRouter.post("/create",validateTokenHeader, createProfile);
profileRouter.put("/update",validateTokenHeader, updateProfile);
profileRouter.get("/get",validateTokenHeader, getProfile);
profileRouter.get('/search',validateTokenHeader, searchProfiles);
// post route
profileRouter.post("/post_create",validateTokenHeader,upload.array("files", 5) , createPost);
profileRouter.get("/post_get", validateTokenHeader, getPost);
profileRouter.get("/post_get/:id", validateTokenHeader,getPostData);
profileRouter.delete("/post_delete/:id", validateTokenHeader, deletePost);
profileRouter.get("/post_view/:id", validateTokenHeader, viewPost);
profileRouter.put("/post_u/:id", validateTokenHeader, upload.array("image", 5), updatePost);
profileRouter.post("/like/:postId", validateTokenHeader,likePost);
profileRouter.get("/like_count/:postId", validateTokenHeader, getLikeCount);
profileRouter.get("/public-profile/:userId", validateTokenHeader, getPublicProfileAndPosts );
profileRouter.post("/comment/:id", validateTokenHeader, commentPost);
module.exports = profileRouter;