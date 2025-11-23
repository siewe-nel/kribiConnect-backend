const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.addReview);
router.get('/:providerId', reviewController.getProviderReviews);

module.exports = router;