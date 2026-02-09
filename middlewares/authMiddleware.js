// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'kribi_secret_key_change_me'; // Doit être la même que dans ton authController

exports.verifyToken = (req, res, next) => {
    // On récupère le token dans le header "Authorization" (format: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Accès refusé. Aucun token fourni." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // On stocke les infos de l'utilisateur (id, role) dans la requête
        next(); // On passe à la suite
    } catch (error) {
        return res.status(401).json({ message: "Token invalide ou expiré." });
    }
};

exports.isAdmin = (req, res, next) => {
    // On vérifie si le rôle stocké dans le token est bien 'admin'
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: "Accès interdit. Rôle Admin requis." });
    }
};