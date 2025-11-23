const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

console.log('--- [Routes] Chargement des routes Auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user/:id', authController.getUserProfile);

// Nouvelle route pour la liste des fournisseurs
router.get('/providers', authController.getAllProviders);
router.put('/user/:id', authController.updateProfile); 
module.exports = router;