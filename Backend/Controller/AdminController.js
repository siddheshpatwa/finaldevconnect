const asynchandler = require("express-async-handler");
const Post = require("../Models/Post");
const User = require("../Models/Users");
const Profile = require("../Models/Profile");

const getAdminPost = asynchandler(async (req, res) => {
  const posts = await Post.find().populate('userId'); // if you want user details

  if (!posts || posts.length === 0) {
    res.status(404);
    throw new Error("No posts found");
  }

  res.status(200).json({
    message: "All posts fetched successfully",
    posts,
  });
});

const deletePost = asynchandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    
    await post.deleteOne();
    res.status(200).json({
        message: "Post deleted successfully",
    });
});

const getAllProfile = asynchandler(async (req, res) => {
    const posts = await Profile.find().populate('userId').sort({ createdAt: -1 });
    if (!posts || posts.length === 0) {
        res.status(404);
        throw new Error("No posts found");
    }
    res.status(200).json({
        message: "Profile fetched successfully",
        posts,
    });
});
const deleteProfile = asynchandler(async (req, res) => {
  console.log(req.params.id);

  const profile = await Profile.findOne({ userId: req.params.id });
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  // Fetch posts (optional: no error if none found)
  const posts = await Post.find({ userId: req.params.id });
  if (!posts || posts.length === 0) {
    console.log("No posts found for this user.");
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Delete all posts associated with the userId
  await Post.deleteMany({ userId: req.params.id });
  // Delete profile and user
  await profile.deleteOne();
  await user.deleteOne();

  res.status(200).json({
    message: "Profile deleted successfully",
  });
});



module.exports = {
  getAdminPost,
  deletePost,
getAllProfile,
deleteProfile
};
