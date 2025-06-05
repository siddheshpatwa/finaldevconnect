const express = require("express");
const postRouter = express.Router();
const validateTokenHeader = require("../Middleware/Validatetokenheader");

postRouter.post("/post_create",validateTokenHeader,upload.array("files", 5) , createPost);
postRouter.get("/post_get", validateTokenHeader, getPost);
postRouter.get("/post_get/:id", validateTokenHeader,getPostData);
postRouter.delete("/post_delete/:id", validateTokenHeader, deletePost);
postRouter.get("/post_view/:id", validateTokenHeader, viewPost);
postRouter.put("/post_u/:id", validateTokenHeader, upload.array("image", 5), updatePost);
postRouter.post("/like/:postId", validateTokenHeader,likePost);
postRouter.get("/like_count/:postId", validateTokenHeader, getLikeCount);
postRouter.get("/public-profile/:userId", validateTokenHeader, getPublicProfileAndPosts );
postRouter.post("/comment/:id", validateTokenHeader, commentPost);

module.exports = postRouter;