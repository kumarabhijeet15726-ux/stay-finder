// ============================================
// middleware/upload.js
// Multer configuration for image uploads
// ============================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Support both standard server environment and Vercel serverless /tmp
let uploadDir;
try {
  uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  uploadDir = '/tmp';
}

// Memory storage or Disk storage depending on write availability
let storage;
try {
  // Test write permission
  const testFile = path.join(uploadDir, '.write-test');
  fs.writeFileSync(testFile, 'ok');
  fs.unlinkSync(testFile);

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E6)}${path.extname(file.originalname).toLowerCase()}`;
      cb(null, uniqueName);
    },
  });
} catch (err) {
  // Fallback to memoryStorage for pure serverless environments without filesystem
  storage = multer.memoryStorage();
}

// File filter: only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|jfif|avif/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const isValidExt = allowedTypes.test(ext);
  const isValidMime = file.mimetype.startsWith('image/');

  if (isValidExt || isValidMime) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WebP or image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per image
    files: 10,
  },
});

module.exports = upload;
