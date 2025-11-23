const { Service, User, Review } = require('../models/Index');

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [
          { model: User, as: 'provider', attributes: ['name', 'avatar'] },
          { model: Review, as: 'reviews' } // Inclure les avis pour calculer la note
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Calculer la moyenne des notes pour chaque service
    const servicesWithRating = services.map(service => {
        const s = service.toJSON();
        const totalRating = s.reviews.reduce((acc, r) => acc + r.rating, 0);
        s.averageRating = s.reviews.length > 0 ? (totalRating / s.reviews.length).toFixed(1) : null;
        // Image principale pour l'affichage liste (la première du tableau)
        s.mainImage = s.images && s.images.length > 0 ? s.images[0] : null;
        return s;
    });

    res.json(servicesWithRating);
  } catch (error) { res.status(500).json({ error: 'Erreur serveur' }); }
};

exports.createService = async (req, res) => {
  try {
    // req.files contient le tableau des fichiers uploadés
    const imagePaths = req.files ? req.files.map(f => `http://localhost:5000/uploads/${f.filename}`) : [];
    
    const serviceData = {
        ...req.body,
        images: imagePaths // Le modèle gérera la conversion en JSON string
    };

    const newService = await Service.create(serviceData);
    res.status(201).json(newService);
  } catch (error) { res.status(500).json({ error: 'Erreur création' }); }
};