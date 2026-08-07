import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

function fileFilter(_req, file, cb) {
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowed.includes(ext)) {
    return cb(new Error("Only JPG, PNG, and WEBP images are allowed"));
  }

  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});



