// middleware/upload.js
const multer = require('multer');

const storage = multer.memoryStorage(); // Store file in memory buffer

const upload = multer({ storage }); // Multer instance

module.exports = upload;
