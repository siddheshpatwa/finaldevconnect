// {/* Posts Section */}
//       <section className="max-w-6xl mx-auto">
//         <h2 className="text-3xl font-semibold mb-6 text-indigo-800">Posts</h2>

//         <div className="flex items-center max-w-md bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm mb-8">
//           <FiSearch className="text-gray-500 mr-2" />
//           <input
//             type="text"
//             placeholder="Search posts by title, description, or user email ..."
//             value={postSearch}
//             onChange={(e) => {
//               setPostSearch(e.target.value);
//               console.log("Post search input:", e.target.value);
//             }}
//             className="w-full outline-none text-sm bg-transparent"
//           />
//         </div>

//         {filteredPosts.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {filteredPosts.map((post) => (
//               <div
//                 key={post._id}
//                 className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 relative"
//               >
//                 <button
//                   onClick={() => deletePost(post._id)}
//                   className="absolute top-3 right-3 text-red-500 hover:text-red-700"
//                   title="Delete Post"
//                 >
//                   <FiTrash2 />
//                 </button>

//                 <h3 className="text-lg font-bold text-indigo-700">
//                   {post.title}
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-2">
//                   <strong>By:</strong> {post.userId?.name || "Unknown User"}
//                 </p>
//                  <p className="text-sm text-gray-600 mb-2">
//                   {post.userId?.email|| "Unknown User"}
//                 </p>
//                 {console.log("Post userId:", post)}

//                 {post.img && post.img.length > 0 && (
//                   <img
//                     src={post.img[0]}
//                     alt={post.alt || "Post image"}
//                     className="w-full max-h-[250px] object-cover rounded-lg mb-3"
//                   />
//                 )}

//                 <p className="text-gray-700 text-sm whitespace-pre-line">
//                   {post.desc.trim()}
//                 </p>

//                 {post.caption && (
//                   <p className="text-indigo-600 font-semibold mt-2">
//                     Caption: {post.caption}
//                   </p>
//                 )}

//                 {post.hashtags && (
//                   <p className="text-sm text-indigo-500 mt-1">
//                     Hashtags:{" "}
//                     {post.hashtags.split(",").map((tag, i) => (
//                       <span key={i} className="mr-2">
//                         #{tag.trim()}
//                       </span>
//                     ))}
//                   </p>
//                 )}

          

//                 {post.location && (
//                   <p className="text-sm italic text-gray-600 mt-1">
//                     Location: {post.location}
//                   </p>
//                 )}

//                 <p className="text-xs text-gray-400 mt-2">
//                   Posted on: {new Date(post.createdAt).toLocaleString()}
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   Likes: {post.likes ? post.likes.length : 0}
//                 </p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-600 text-center">No posts found.</p>
//         )}
//       </section>

//         {/* Posts Section2 */}
//       <section>
        
//         <div key={post.id} className="post-card">
//       <div className="post-header">
//         <div className="flex items-center gap-3">
//           <div>
//             <p className="post-username">{post.username}</p>
//             <p className="post-time">{post.timestamp}</p>
//           </div>
//         </div>
//         <div className="relative">
//           <button
//             onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
//             className="text-xl text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
//           >
//             ⋮
//           </button>
//           {openMenuId === post.id && (
//             <div className="absolute top-8 right-0 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md w-32 z-10">
//               <button
//                 onClick={() => alert("Edit coming soon")}
//                 className="block w-full px-4 py-2 text-sm text-indigo-500 dark:text-indigo-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
//               >
//                 ✏️ Edit Post
//               </button>
//               <button
//                 onClick={() => handleDeletePost(post.id)}
//                 className="block w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
//               >
//                 🗑️ Delete Post
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <p className="post-title">{post.title}</p>
//       {post.image && (
//         <img
//           src={post.image}
//           alt="Post"
//           onError={(e) => (e.target.src = "/default-image.jpg")}
//           className="w-full h-64 object-cover rounded-xl mt-2"
//         />
//       )}
//       <p className="post-description">{post.description}</p>

//       {expandedPostId === post.id ? (
//         <>
//           <p className="extra-info">📍 {post.location}</p>
//           <p className="extra-info">📝 {post.caption}</p>
//           <p className="extra-info">🏷️ {post.hashtags}</p>
//           <div className="toggle-info-btn" onClick={() => setExpandedPostId(null)}>
//             Show Less
//           </div>
//         </>
//       ) : (
//         <div className="toggle-info-btn" onClick={() => setExpandedPostId(post.id)}>
//           Show More
//         </div>
//       )}

//       <div className="action-row">
//         <div
//           className={`like-btn ${post.likes.includes(userId) ? "liked" : ""}`}
//           onClick={() => toggleLike(post.id)}
//         >
//           <FiHeart />
//           {post.likes.includes(userId) ? "Liked" : "Like"}
//         </div>
//         <span className="likes-count">
//           {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
//         </span>
//       </div>

//       <div className="comments-section">
//         <div className="flex justify-between items-center">
//           <h3 className="text-indigo-500 dark:text-indigo-300 font-semibold">
//             Comments ({post.comments.length})
//           </h3>
//           <button
//             onClick={() => toggleComments(post.id)}
//             className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1"
//           >
//             {showComments[post.id] ? (
//               <>
//                 <FiChevronUp /> Hide
//               </>
//             ) : (
//               <>
//                 <FiChevronDown /> Show
//               </>
//             )}
//           </button>
//         </div>

//         {showComments[post.id] && (
//           <>
//             {post.comments.length === 0 ? (
//               <p className="text-gray-500 italic mb-4 dark:text-gray-400">
//                 No comments yet.
//               </p>
//             ) : (
//               post.comments.map((comment) => (
//                 <div key={comment._id} className="comment mt-3">
//                   <p className="comment-name">{comment.name}</p>
//                   <p className="comment-text">{comment.text}</p>
//                   <p className="comment-meta">
//                     {new Date(comment.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//               ))
//             )}

//             <form
//               onSubmit={(e) => handleCommentSubmit(e, post.id)}
//               className="flex space-x-3 mt-2"
//             >
//               <input
//                 type="text"
//                 placeholder="Add a comment..."
//                 value={commentInputs[post.id] || ""}
//                 onChange={(e) =>
//                   setCommentInputs((prev) => ({
//                     ...prev,
//                     [post.id]: e.target.value,
//                   }))
//                 }
//                 className="flex-grow border border-cyan-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                 required
//               />
//               <button
//                 type="submit"
//                 disabled={!commentInputs[post.id]?.trim()}
//                 className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-5 py-2 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Post
//               </button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//       </section>
import React from 'react'

const AdminPost = () => {
  return (
    <div>
        {/* Posts Section 2 (Alternate Style) */}
<section className="max-w-6xl mx-auto mt-16">
  <h2 className="text-3xl font-semibold mb-6 text-indigo-800">Alternate Post View</h2>
  {posts.length === 0 ? (
    <p className="text-gray-600 text-center">No posts found.</p>
  ) : (
    posts.map((post) => (
      <div key={post._id} className="bg-white p-5 mb-10 rounded-xl shadow-lg relative">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-indigo-700 text-lg">{post.userId?.name || "Unknown User"}</p>
            <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
          </div>
          <button
            onClick={() => deletePost(post._id)}
            className="text-red-500 hover:text-red-700"
            title="Delete Post"
          >
            <FiTrash2 />
          </button>
        </div>

        <h3 className="text-xl mt-4 mb-2 font-bold text-gray-800">{post.title}</h3>
        <p className="text-sm text-gray-600">{post.desc}</p>

        {post.img && post.img.length > 0 && (
          <img
            src={post.img[0]}
            alt={post.alt || "Post image"}
            className="w-full max-h-[250px] object-cover rounded-lg mt-4"
          />
        )}

        {post.caption && (
          <p className="text-indigo-600 mt-2 font-medium">📝 {post.caption}</p>
        )}
        {post.hashtags && (
          <p className="text-sm mt-1 text-indigo-500">
            🏷️ {post.hashtags.split(",").map((tag, i) => (
              <span key={i} className="mr-1">#{tag.trim()}</span>
            ))}
          </p>
        )}
        {post.location && (
          <p className="text-sm italic mt-2 text-gray-500">📍 {post.location}</p>
        )}

        <p className="text-sm mt-3 text-gray-400">Likes: {post.likes?.length || 0}</p>
      </div>
    ))
  )}
</section>

      
    </div>
  )
}

export default AdminPost
