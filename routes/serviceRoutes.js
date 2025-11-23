const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

console.log('--- [Routes] Chargement des routes Services (Cloudinary)');

// Configuration Cloudinary avec vos identifiants
cloudinary.config({
  cloud_name: 'dubn7vy1i',
  api_key: '261216888581652',
  api_secret: '9GAlO5QX1H5kAfuWtlJZEJmiB9Y'
});

// Configuration du stockage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kribiconnect_services', // Nom du dossier sur Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

// Routes
router.get('/', serviceController.getAllServices);

// Upload multiple (max 5 images)
router.post('/', upload.array('images', 5), serviceController.createService);

module.exports = router;