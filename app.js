const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db');
const { sequelize } = require('./models/Index'); 
const { seedAdmin } = require('./config/seed'); // Import du code ci-dessus
// --- IMPORTS DES ROUTES ---
const serviceRoutes = require('./routes/serviceRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// --- CONFIGURATION CORS ---
const allowedOrigins = [
  'https://kribi-connect.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// NOTE : On a supprimé app.use('/uploads'...) car Cloudinary gère les fichiers maintenant.
exports.seedAdmin = async () => {
  try {
    const adminEmail = "nel@kribiconnect.com"; // Email par défaut pour l'admin nel
    const existingAdmin = await User.findOne({ where: { name: 'nel' } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('nel1234', 10);
      await User.create({
        name: 'nel',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        avatar: `https://ui-avatars.com/api/?name=nel&background=E63946&color=fff`
      });
      console.log("Admin par défaut 'nel' créé avec succès.");
    }
  } catch (error) {
    console.error("Erreur lors du seeding de l'admin:", error);
  }
};
// --- ROUTES API ---
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('API Kribiconnect en ligne (Vercel + Cloudinary + MySQL Cloud)');
});

// --- DÉMARRAGE ---

const startServer = async () => {
  try {
    // 1. Connexion et synchronisation
    // Utilise 'alter: true' en dev pour mettre à jour les colonnes sans tout supprimer
    // Utilise 'force: false' en prod pour ne rien casser
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' }); 
    console.log("--- [Database] Connexion et synchronisation réussies ---");

    // 2. Lancement du seeding automatique de l'admin
    await seedAdmin();

    // 3. Gestion du port (Crucial pour Vercel)
    // NOTE : Vercel n'aime pas trop le "app.listen" classique dans ses Serverless Functions.
    // Mais pour garder la compatibilité locale, on l'isole :
    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`🚀 [Local] Serveur prêt sur http://localhost:${PORT}`);
      });
    } else {
      console.log("--- [Production] Mode Serverless activé (Vercel) ---");
    }
  } catch (error) {
    console.error("❌ !!! Erreur fatale au démarrage:", error);
    // On ne veut pas que le processus continue si la DB est HS
    process.exit(1); 
  }
};


// Lancer l'initialisation
startServer();

module.exports = app;