const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|mp4|mov|avi|mkv/;
  const extValid = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowed.test(file.mimetype);
  if (extValid && mimeValid) cb(null, true);
  else cb(new Error("Only images and videos are allowed"));
};

module.exports = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter,
});
