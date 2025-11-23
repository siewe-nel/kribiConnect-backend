const { Sequelize } = require('sequelize');

// Assurez-vous d'avoir créé une base de données vide nommée 'kribiconnect_db' dans phpMyAdmin ou Workbench
// CREATE DATABASE kribiconnect_db;

console.log('--- [Config] Initialisation de la connexion Sequelize...');

const sequelize = new Sequelize('kribi', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Mettre à 'true' pour voir les requêtes SQL brutes dans la console
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('--- [Config] Connexion à MySQL réussie via Sequelize !');
  } catch (error) {
    console.error('--- [Config] Erreur de connexion à MySQL:', error);
  }
};

module.exports = { sequelize, connectDB };