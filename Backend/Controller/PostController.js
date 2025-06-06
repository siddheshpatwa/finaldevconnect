const asynchandler = require("express-async-handler");
const Post = require("../Models/Post");
const User = require("../Models/Users");
const cloudinary = require("../Config/cloudinary");
const fs = require("fs");

const createPost = asynchandler(async (req, res) => {
  

    const {  title,img, desc, caption, hashtags, tags, location, alt } = req.body;

    const user = await User.findById(req.user._id);
     let uploadedMedia = [];

  // Upload all files to Cloudinary
  if (req.files && req.files.length > 0) {
    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "posts",
        resource_type: "auto", // auto-detects image/video
      });
      uploadedMedia.push(result.secure_url);

      // Delete local file after upload
      fs.unlinkSync(file.path);
    }
  }

    const post = await Post.create({
        userId: user._id,
        name: user.name,
        email: user.email,
        img: uploadedMedia,
        title,
        desc,
        caption,
        hashtags,
        tags,
        location,
        alt,
    });

    return res.status(201).json({
        message: "Post created successfully",
        post,
    });
});
const getPost = asynchandler(async (req, res) => {
        const post = await Post.find ({ userId: req.user._id } );
        console.log(req.user._id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    res.status(200).json({
        message: "Post fetched successfully",
        post,
    });
})
const updatePost = asynchandler(async (req, res) => {
  const {
    title,
    desc,
    caption,
    hashtags,
    tags,
    location,
    alt
  } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (post.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Leave image logic as-is (no changes)
  let uploadedMedia = post.img;
  if (req.files && req.files.length > 0) {
    uploadedMedia = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "posts",
        resource_type: "auto",
      });
      uploadedMedia.push(result.secure_url);
      fs.unlinkSync(file.path);
    }
  }

  // 🔁 Only update fields if defined — allow empty string
  post.title = title !== undefined ? title : post.title;
  post.desc = desc !== undefined ? desc : post.desc;
  post.caption = caption !== undefined ? caption : post.caption;
  post.hashtags = hashtags !== undefined ? hashtags : post.hashtags;
  post.tags = tags !== undefined ? tags : post.tags;
  post.location = location !== undefined ? location : post.location;
  post.alt = alt !== undefined ? alt : post.alt;
  post.img = uploadedMedia;

  const updatedPost = await post.save();

  res.status(200).json({
    message: "Post updated successfully",
    post: updatedPost,
  });
});


const getPostData= asynchandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    res.status(200).json({
        message: "Post fetched successfully",
        post,
    });
});
const viewPost = asynchandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    // Increment view count
    // post.views = (post.views || 0) + 1; // Initialize views if undefined
    await post.save();
    res.status(200).json({
        message: "Post viewed successfully",
        post,
    });
});
const deletePost = asynchandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    if (post.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("User not authorized");
    }
    await post.deleteOne();
    res.status(200).json({
        message: "Post deleted successfully",
    });
});

const likePost = asynchandler(async (req, res) => {
    const post = await Post.findById(req.params.postId);  // <-- Use postId here
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    if (post.likes.includes(req.user._id)) {
        // User already liked the post, so remove like
        post.likes = post.likes.filter(
            (like) => like.toString() !== req.user._id.toString()
        );
    } else {
        // User hasn't liked the post, so add like
        post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
        message: "Post liked/unliked successfully",
        likes: post.likes,
    });
});

const getLikeCount = asynchandler(async (req, res) => {
    const post = await Post.findById(req.params.postId);  // <-- Use postId here
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    res.status(200).json({
        message: "Like count fetched successfully",
        likeCount: post.likes.length,
    });
});

const commentPost = asynchandler(async (req, res) => {
    const { comment } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
   if (!comment || comment.trim() === "") {
        res.status(400);
        throw new Error("Comment text is required");
    }
    const user=await User.findById(req.user._id);
    console.log(req.user._id);
    console.log(user);
    console.log("name:",user.name); 
    post.comments.push({
         user: req.user._id,     
        text: comment ,
        name:  user.name,
    });

    await post.save();

    res.status(200).json({
        message: "Comment added successfully",
        comments: post.comments,
    });
});
module.exports = {
    createPost,
    updatePost,
    getPost,
    getPostData,
    viewPost,
    deletePost,
    likePost,
    getLikeCount,
    commentPost
}