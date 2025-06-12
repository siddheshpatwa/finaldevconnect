const asynchandler = require("express-async-handler");
const Post = require("../Models/Post");
const User = require("../Models/Users");
const Profile = require("../Models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../Config/cloudinary");
const fs = require("fs");

const getAdminPost = asynchandler(async (req, res) => {
  const posts = await Post.find().populate('userId'); // if you want user details
  const user = await User.find().populate('_id');
  console.log(user);
  if (!posts || posts.length === 0) {
    res.status(404);
    throw new Error("No posts found");
  }
  const email = user.email;


  res.status(200).json({
    message: "All posts fetched successfully",
    posts,
    email
    
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

const adminLogin=(async(req , res)=>{
  try {

     const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  // Find the user with the provided email
  const user = await User.findOne({ email });

  // Check if user exists and password matches
const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  // Check if the user is an admin
  if (user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied, admin only controller" });
  }

  // Generate a token (assuming you have a method to generate JWT)
const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name, // Include name if needed
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  res.status(200).json({
    message: "Login successful as admin",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
    
  } catch (error) {
    console.error("Error during admin login:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
    
  }
})

const editRole=(async(req,res)=>{
  try {
    const {role,id}= req.body;
     const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role="admin";
    await user.save();
    res.status(200).json({
      message: "Role updated successfully",
      user: {
        id,
        role
      },
    })

  } catch (error) {
    console.error("Error during role edit:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
    
  }
})

// protected routes For admin
//edit post

const EditPostAdmin = asynchandler(async (req, res) => {
  const {
    title,
    desc,
    caption,
    hashtags,
    tags,
    location,
    alt
  } = req.body;
  console.log(req.body);
  

  const post = await Post.findById(req.params.id);
  console.log("post", req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

 const user = await User.findById(req.admin._id);
if(!user){
  return res.status(404).json({ message: "Admin not found" });
} // Leave image logic as-is (no changes)
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

  // Only update fields if defined — allow empty string
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

// protected route for updating profile


const updateProfiletAdmin = asynchandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.params.id });
  const user = await Profile.findOne({ userId: req.params.id });
  if (!profile) {
    res.status(404);
    throw new Error("Profile not found");
  }
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  profile.name = req.body.name || profile.name;
  profile.email = req.body.email || profile.email;
  profile.bio = req.body.bio || profile.bio;
  profile.skills = req.body.skills || profile.skills;
  profile.socialLinks = req.body.socialLinks || profile.socialLinks;
  const updatedProfile = await profile.save();
  const updateUser = await user.save();
  res.status(200).json({
    message: "Profile updated", profile: updatedProfile, user: updateUser
  });
})

const getAdminPostData= asynchandler(async (req, res) => {
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


module.exports = {
  getAdminPost,
  deletePost,
getAllProfile,
deleteProfile,
  adminLogin,
  editRole,
  EditPostAdmin,
  updateProfiletAdmin,
  getAdminPostData
};
