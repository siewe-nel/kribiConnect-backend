const { Service, User, Review } = require('../models/Index');

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [
          { model: User, as: 'provider', attributes: ['name', 'avatar'] },
          { model: Review, as: 'reviews' }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    const servicesWithRating = services.map(service => {
        const s = service.toJSON();
        const totalRating = s.reviews.reduce((acc, r) => acc + r.rating, 0);
        s.averageRating = s.reviews.length > 0 ? (totalRating / s.reviews.length).toFixed(1) : null;
        
        // L'image est déjà une URL complète (Cloudinary)
        // On prend la première image du tableau si elle existe
        s.mainImage = s.images && s.images.length > 0 ? s.images[0] : null;
        
        return s;
    });

    res.json(servicesWithRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createService = async (req, res) => {
  console.log('--> [ServiceController] Création service avec Cloudinary');
  try {
    // Cloudinary renvoie le chemin complet dans 'path'
    const imagePaths = req.files ? req.files.map(f => f.path) : [];
    
    const serviceData = {
        ...req.body,
        images: imagePaths // Sequelize convertira ce tableau en string JSON grâce au modèle
    };

    const newService = await Service.create(serviceData);
    res.status(201).json(newService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur création' });
  }
};