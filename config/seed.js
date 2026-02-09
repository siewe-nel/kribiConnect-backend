const bcrypt = require('bcryptjs'); // Plus stable sur Vercel que 'bcrypt'
const User = require('../models/User'); // /!\ Vérifie bien le chemin et la majuscule

const seedAdmin = async () => {
  try {
    const adminEmail = "nel@kribiconnect.com";
    
    // 1. On vérifie si l'admin existe déjà par son EMAIL (plus fiable que le nom)
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      console.log("--- [Seed] Création de l'administrateur par défaut... ---");
      
      const hashedPassword = await bcrypt.hash('nel1234', 10);
      
      await User.create({
        name: 'nel',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        avatar: `https://ui-avatars.com/api/?name=nel&background=E63946&color=fff`
      });

      console.log("✅ [Seed] Admin 'nel' créé avec succès.");
    } else {
      console.log("ℹ️ [Seed] L'admin existe déjà, passage de l'étape de création.");
    }
  } catch (error) {
    console.error("❌ [Seed] Erreur lors du seeding de l'admin:", error.message);
    // On ne bloque pas tout le serveur si le seed échoue, mais on log l'erreur
  }
};

module.exports = { seedAdmin };