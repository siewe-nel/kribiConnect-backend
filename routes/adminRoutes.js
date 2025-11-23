const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Stats globales
router.get('/stats', adminController.getStats);

// Gestion Utilisateurs (CRUD)
router.get('/users/:role', adminController.getUsersByRole); // ex: /api/admin/users/client
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;