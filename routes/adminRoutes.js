// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// --- PROTECTION GLOBALE ---
// Toutes les routes définies après ces deux lignes seront protégées
router.use(verifyToken);
router.use(isAdmin);

// Stats globales (Désormais inaccessible sans être admin connecté)
router.get('/stats', adminController.getStats);

// Gestion Utilisateurs (CRUD)
router.get('/users/:role', adminController.getUsersByRole);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;