const { User, Review } = require('../models/Index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'kribi_secret_key_change_me'; 

// --- 1. Inscription ---
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'client',
      // On laisse l'avatar à null pour que le frontend affiche l'icône par défaut
      avatar: null 
    });

    // Générer le token
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, SECRET_KEY, { expiresIn: '24h' });

    res.status(201).json({
      message: "Inscription réussie",
      token,
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role, 
        avatar: newUser.avatar 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
};

// --- 2. Connexion ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Générer le token
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '24h' });

    // Mise à jour de la dernière connexion (Last Seen) pour le statut "En ligne"
    user.lastSeen = new Date();
    await user.save();

    res.json({
      message: "Connexion réussie",
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        avatar: user.avatar 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
};

// --- 3. Récupérer un profil par ID ---
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Review, as: 'receivedReviews' }] // On inclut les avis reçus
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Calcul de la moyenne en temps réel
    const userData = user.toJSON();
    const reviews = userData.receivedReviews || [];
    
    if (reviews.length > 0) {
        const total = reviews.reduce((acc, r) => acc + r.rating, 0);
        userData.averageRating = (total / reviews.length).toFixed(1); // Ex: "4.5"
        userData.reviewCount = reviews.length;
    } else {
        userData.averageRating = null;
        userData.reviewCount = 0;
    }

    // On nettoie pour ne pas renvoyer la liste complète des reviews ici si on la charge ailleurs
    delete userData.receivedReviews; 

    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --- 4. Récupérer tous les fournisseurs avec leur note moyenne ---
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await User.findAll({
      where: { role: 'provider' },
      attributes: { exclude: ['password'] },
      include: [{ model: Review, as: 'receivedReviews' }] // Inclure les avis reçus
    });

    // Calcul de la note moyenne pour chaque fournisseur
    const providersWithStats = providers.map(p => {
        const provider = p.toJSON();
        
        const totalRating = provider.receivedReviews.reduce((acc, r) => acc + r.rating, 0);
        
        // Calcul de la moyenne (arrondi à 1 décimale)
        provider.averageRating = provider.receivedReviews.length > 0 
            ? (totalRating / provider.receivedReviews.length).toFixed(1) 
            : null;
            
        provider.reviewCount = provider.receivedReviews.length;
        
        return provider;
    });

    res.json(providersWithStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur récupération fournisseurs" });
  }
};

// --- 5. Mettre à jour son propre profil ---
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body; // On ne gère pas le password ici pour simplifier

    // Mise à jour en base
    await User.update({ name, email }, { where: { id } });
    
    // Récupérer l'user mis à jour pour le renvoyer au front
    const updatedUser = await User.findByPk(id, { 
        attributes: { exclude: ['password'] } 
    });

    res.json({ message: "Profil mis à jour", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur mise à jour" });
  }
};