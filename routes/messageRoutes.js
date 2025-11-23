const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

console.log('--- [Routes] Chargement des routes Messages (Cloudinary)');

// Configuration Cloudinary (Même config, déjà chargée mais on la remet par sécurité)
cloudinary.config({
  cloud_name: 'dubn7vy1i',
  api_key: '261216888581652',
  api_secret: '9GAlO5QX1H5kAfuWtlJZEJmiB9Y'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kribiconnect_messages',
    resource_type: 'auto', // Permet PDF, etc.
  },
});

const upload = multer({ storage: storage });

router.get('/conversations/:userId', messageController.getConversations);
router.get('/:userId1/:userId2', messageController.getConversation);

// Upload unique pour un message
router.post('/', upload.single('file'), messageController.sendMessage);

module.exports = router;