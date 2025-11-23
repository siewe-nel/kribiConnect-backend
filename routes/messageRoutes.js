const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ... (Configuration Multer inchangée) ...
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)){ fs.mkdirSync(uploadDir, { recursive: true }); }

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, uploadDir); },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// Routes
router.get('/conversations/:userId', messageController.getConversations); // <--- NOUVELLE ROUTE
router.get('/:userId1/:userId2', messageController.getConversation);
router.post('/', upload.single('file'), messageController.sendMessage);

module.exports = router;