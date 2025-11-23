const { User, Service } = require('../models/Index');
const bcrypt = require('bcryptjs');

// 1. Stats Globales
exports.getStats = async (req, res) => {
  try {
    const userCount = await User.count();
    const serviceCount = await Service.count();
    const providerCount = await User.count({ where: { role: 'provider' } });
    const adminCount = await User.count({ where: { role: 'admin' } });
    const clientCount = await User.count({ where: { role: 'client' } });

    res.json({
        totalUsers: userCount,
        services: serviceCount,
        providers: providerCount,
        admins: adminCount,
        clients: clientCount
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur stats" });
  }
};

// 2. Récupérer utilisateurs par rôle
exports.getUsersByRole = async (req, res) => {
    const { role } = req.params; // 'client', 'provider', 'admin' ou 'all'
    try {
        const whereClause = role === 'all' ? {} : { role };
        const users = await User.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erreur liste utilisateurs" });
    }
};

// 3. Créer un utilisateur (Admin, Client ou Fournisseur)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email déjà pris" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name, email, password: hashedPassword, role,
            avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
        });

        res.status(201).json({ message: "Utilisateur créé", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Erreur création" });
    }
};

// 4. Modifier un utilisateur
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        
        await User.update({ name, email, role }, { where: { id } });
        res.json({ message: "Utilisateur mis à jour" });
    } catch (error) {
        res.status(500).json({ message: "Erreur mise à jour" });
    }
};

// 5. Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.json({ message: "Utilisateur supprimé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur suppression" });
    }
};