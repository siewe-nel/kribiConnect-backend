const { Review, User } = require('../models/Index');

// Ajouter un avis
exports.addReview = async (req, res) => {
  try {
    const { targetUserId, reviewerId, rating, comment } = req.body;

    // Vérifier si l'utilisateur a déjà noté ce fournisseur (optionnel, pour éviter le spam)
    const existingReview = await Review.findOne({
        where: { targetUserId, reviewerId }
    });

    if (existingReview) {
        return res.status(400).json({ message: "Vous avez déjà noté ce fournisseur." });
    }

    const newReview = await Review.create({
        targetUserId,
        reviewerId,
        rating,
        comment
    });

    // On renvoie l'avis avec les infos du notateur pour l'affichage direct
    const fullReview = await Review.findByPk(newReview.id, {
        include: [{ model: User, as: 'reviewer', attributes: ['name', 'avatar'] }]
    });

    res.status(201).json(fullReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'avis" });
  }
};

// Récupérer les avis d'un fournisseur
exports.getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;
    const reviews = await Review.findAll({
        where: { targetUserId: providerId },
        include: [{ model: User, as: 'reviewer', attributes: ['name', 'avatar'] }],
        order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération avis" });
  }
};