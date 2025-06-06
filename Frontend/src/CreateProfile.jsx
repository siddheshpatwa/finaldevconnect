import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiLink,
  FiBookOpen,
  FiTag,
} from "react-icons/fi";

// 👇 Validation Schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
    .required("Name is required"),
  bio: Yup.string()
    .matches(/^[A-Za-z\s]*$/, "Only letters and spaces are allowed")
    .max(200, "Bio must be under 200 characters"),
  skills: Yup.string()
    .matches(
      /^([a-zA-Z]+)(,\s*[a-zA-Z]+)*$/,
      "Enter comma-separated skills (letters only)"
    )
    .required("Skills are required"),
  github: Yup.string().url("Invalid GitHub URL").nullable(),
  linkedin: Yup.string().url("Invalid LinkedIn URL").nullable(),
  twitter: Yup.string().url("Invalid Twitter URL").nullable(),
  portfolio: Yup.string().url("Invalid Portfolio URL").nullable(),
});

const CreateProfile = () => {
  const navigate = useNavigate();

  const normalizeUrl = (url) => {
    if (!url) return "";
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      bio: "",
      skills: "",
      github: "",
      linkedin: "",
      twitter: "",
      portfolio: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const token = localStorage.getItem("token");

      const payload = {
        name: values.name,
        bio: values.bio,
        skills: values.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
        socialLinks: {
          github: normalizeUrl(values.github),
          linkedin: normalizeUrl(values.linkedin),
          twitter: normalizeUrl(values.twitter),
          portfolio: normalizeUrl(values.portfolio),
        },
      };

      try {
        await axios.post(
          "http://localhost:3000/api/user/profile/create",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        navigate("/profile");
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || err.message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full p-10 bg-white rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Create Your Profile
        </h2>

        {formik.errors.submit && (
          <p className="mb-4 text-center text-red-600 font-medium animate-pulse">
            {formik.errors.submit}
          </p>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <InputWithIcon
            icon={<FiUser />}
            name="name"
            placeholder="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && formik.errors.name}
            onBlur={formik.handleBlur}
            required
          />
          <InputWithIcon
            icon={<FiBookOpen />}
            name="bio"
            placeholder="Short Bio"
            value={formik.values.bio}
            onChange={formik.handleChange}
            error={formik.touched.bio && formik.errors.bio}
            onBlur={formik.handleBlur}
          />
          <InputWithIcon
            icon={<FiTag />}
            name="skills"
            placeholder="Skills (comma-separated)"
            value={formik.values.skills}
            onChange={formik.handleChange}
            error={formik.touched.skills && formik.errors.skills}
            onBlur={formik.handleBlur}
            required
          />
          <InputWithIcon
            icon={<FiGithub />}
            name="github"
            placeholder="GitHub URL"
            value={formik.values.github}
            onChange={formik.handleChange}
            error={formik.touched.github && formik.errors.github}
            onBlur={formik.handleBlur}
          />
          <InputWithIcon
            icon={<FiLinkedin />}
            name="linkedin"
            placeholder="LinkedIn URL"
            value={formik.values.linkedin}
            onChange={formik.handleChange}
            error={formik.touched.linkedin && formik.errors.linkedin}
            onBlur={formik.handleBlur}
          />
          <InputWithIcon
            icon={<FiTwitter />}
            name="twitter"
            placeholder="Twitter URL"
            value={formik.values.twitter}
            onChange={formik.handleChange}
            error={formik.touched.twitter && formik.errors.twitter}
            onBlur={formik.handleBlur}
          />
          <InputWithIcon
            icon={<FiLink />}
            name="portfolio"
            placeholder="Portfolio URL"
            value={formik.values.portfolio}
            onChange={formik.handleChange}
            error={formik.touched.portfolio && formik.errors.portfolio}
            onBlur={formik.handleBlur}
          />

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 transition duration-300"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

// 👇 Enhanced InputWithIcon with error display
const InputWithIcon = ({
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  onBlur,
  required = false,
  error,
}) => (
  <div>
    <div className="relative">
      <span className="absolute top-3 left-4 text-gray-400">{icon}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={`w-full pl-12 pr-4 py-3 border ${
          error ? "border-red-400" : "border-gray-300"
        } rounded-full shadow-sm focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-400" : "focus:ring-indigo-400"
        } text-gray-700 placeholder-gray-400`}
      />
    </div>
    {error && (
      <p className="text-red-500 text-sm mt-1 ml-2">{error}</p>
    )}
  </div>
);

export default CreateProfile;
