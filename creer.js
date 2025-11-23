const { sequelize } = require('./models/Index');
const { User } = require('./models/Index');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    // 1. Connexion à la BD
    await sequelize.authenticate();
    console.log('Connexion réussie.');

    // 2. Infos de l'admin
    const adminData = {
      name: 'nel',
      email: 'nel@kribiconnect.cm', // Email fictif pour l'admin
      password: 'vitris@33',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Nel&background=0D8ABC&color=fff'
    };

    // 3. Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email: adminData.email } });
    if (existingUser) {
      console.log('Cet utilisateur existe déjà. Mise à jour du rôle en admin...');
      existingUser.role = 'admin';
      await existingUser.save();
      console.log('Utilisateur passé en admin avec succès.');
      process.exit();
    }

    // 4. Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // 5. Création
    await User.create({
      ...adminData,
      password: hashedPassword
    });

    console.log(`Admin "${adminData.name}" créé avec succès !`);
    console.log(`Login: ${adminData.email}`);
    console.log(`Pass: ${adminData.password}`);

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
  } finally {
    await sequelize.close();
  }
};

createAdmin();