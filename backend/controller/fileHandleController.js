const multer = require("multer");
const path = require("path");
const fs = require("fs");


// Common storage function
const storageConfig = (folderName) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = `media/${folderName}`;
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

// File filter (only images allowed)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Separate upload handlers
const uploadProduct = multer({
  storage: storageConfig("products"),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});


module.exports = {uploadProduct};