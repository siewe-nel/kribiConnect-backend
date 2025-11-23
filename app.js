const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { connectDB } = require('./config/db');
// Correction 1 : juste './models' (évite les erreurs de majuscule/minuscule sur index.js)
const { sequelize } = require('./models/Index'); 

// --- IMPORTS DES ROUTES ---
const serviceRoutes = require('./routes/serviceRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('====================================');
console.log('   DÉMARRAGE SERVEUR KRIBICONNECT   ');
console.log('====================================');

// --- MIDDLEWARES ---
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- CONFIGURATION FICHIERS STATIQUES ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- DÉFINITION DES ROUTES API ---
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

// Route de base
app.get('/', (req, res) => {
  res.send('API Kribiconnect en ligne (Auth + Uploads + Admin + Reviews)');
});

// --- DÉMARRAGE ---
const startServer = async () => {
  try {
    await connectDB();
    
    // Correction 2 : C'EST ICI L'IMPORTANT !
    // 'alter: true' va détecter que la table Review manque et la créer sans effacer le reste.
    await sequelize.sync({ alter: true }); 
    
    console.log('--- [Database] Tables synchronisées et mises à jour (alter: true)');
    
    app.listen(PORT, () => {
      console.log(`\n>>> Serveur prêt sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('!!! Erreur fatale au démarrage:', error);
  }
};

startServer();