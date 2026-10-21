const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "footverse/products",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG and PNG images are allowed"));
    }
};

const uploadProduct = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024,
        files: 5,
    },
    fileFilter,
});

module.exports = { uploadProduct };