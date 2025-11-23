const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2'); // Indispensable pour Vercel
require('dotenv').config();

console.log('--- [Config] Initialisation de la connexion Sequelize...');

// On utilise les variables d'environnement si elles existent (sur Vercel), sinon vos valeurs en dur
const sequelize = new Sequelize(
  process.env.DB_NAME || 'sql3809084',
  process.env.DB_USER || 'sql3809084',
  process.env.DB_PASS || 'ZCpGNsMQhX',
  {
    host: process.env.DB_HOST || 'sql3.freesqldatabase.com',
    dialect: 'mysql',
    dialectModule: mysql2, // CRUCIAL pour le déploiement Vercel
    logging: false,
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
        // FreeSqlDatabase ne demande généralement pas de SSL, mais si erreur de connexion, décommentez ceci :
        /*
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
        */
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('--- [Config] Connexion à MySQL réussie via Sequelize !');
  } catch (error) {
    console.error('--- [Config] Erreur de connexion à MySQL:', error);
  }
};

module.exports = { sequelize, connectDB };