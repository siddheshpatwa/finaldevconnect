import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "axios";

const defaultAvatar = "https://www.w3schools.com/howto/img_avatar.png";

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedData = location.state?.profileData;

  const [form, setForm] = useState({
    name: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    twitter: "",
    portfolio: "",
  });

  const [previewImage, setPreviewImage] = useState(defaultAvatar);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (passedData) {
      setForm({
        name: passedData.name || "",
        bio: passedData.bio || "",
        skills: passedData.skills || "",
        github: passedData.socialLinks?.github || "",
        linkedin: passedData.socialLinks?.linkedin || "",
        twitter: passedData.socialLinks?.twitter || "",
        portfolio: passedData.socialLinks?.portfolio || "",
      });
      setPreviewImage(passedData.image || defaultAvatar);
    }
  }, [passedData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("token");

  //   try {
  //     // If image is selected, upload it first
  //     let imageUrl = passedData?.image || "";

  //     if (selectedImage) {
  //       const imgForm = new FormData();
  //       imgForm.append("image", selectedImage);

  //       const imgUploadRes = await axios.post(
  //         "http://localhost:3000/api/user/profile/upload-image", // Make sure this route exists in backend
  //         imgForm,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       imageUrl = imgUploadRes.data.image; // You must send image URL in backend response
  //     }

  //     // Update other profile details
  //     await api.put(
  //       "http://localhost:3000/api/user/profile/update",
  //       {
  //         name: form.name,
  //         bio: form.bio,
  //         skills: form.skills,
  //         image: imageUrl,
  //         socialLinks: {
  //           github: form.github,
  //           linkedin: form.linkedin,
  //           twitter: form.twitter,
  //           portfolio: form.portfolio,
  //         },
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     navigate("/profile");
  //   } catch (err) {
  //     console.error("Update failed", err);
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  setIsLoading(true);

  try {
    let imageUrl = passedData?.image || "";

    if (selectedImage) {
      const imgForm = new FormData();
      imgForm.append("image", selectedImage);

      const imgUploadRes = await axios.post(
        "http://localhost:3000/api/user/profile/upload-image",
        imgForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      imageUrl = imgUploadRes.data.image;
    }

    await api.put(
      "http://localhost:3000/api/user/profile/update",
      {
        name: form.name,
        bio: form.bio,
        skills: form.skills,
        image: imageUrl,
        socialLinks: {
          github: form.github,
          linkedin: form.linkedin,
          twitter: form.twitter,
          portfolio: form.portfolio,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    navigate("/profile");
  } catch (err) {
    console.error("Update failed", err);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-8">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Edit Your Profile</h2>

        {/* Profile Image Upload */}
        <div className="text-center mb-6">
          <img
            src={previewImage}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full border-4 border-cyan-400 object-cover shadow-md"
          />
          <label className="inline-block mt-3 bg-cyan-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-cyan-600 transition">
          Update Profile Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Name", name: "name" },
            { label: "Bio", name: "bio" },
            { label: "Skills", name: "skills" },
            { label: "GitHub", name: "github" },
            { label: "LinkedIn", name: "linkedin" },
            { label: "Twitter", name: "twitter" },
            { label: "Portfolio", name: "portfolio" },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-gray-700 font-medium mb-1">
                {field.label}
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          <div className="flex justify-end">
          <button
  type="submit"
  disabled={isLoading}
   className={`px-6 py-2 rounded-lg text-white transition duration-200  mr-[15em] ${
      isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
    }`}
>
  {isLoading ? 'Saving...' : 'Save Changes'}
</button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile; 