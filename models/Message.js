const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Message = sequelize.define('message', {
  content: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  // Nouveau : Stocke les infos du produit en JSON (titre, image, prix)
  productContext: {
    type: DataTypes.TEXT, // On utilise TEXT pour stocker du JSON
    allowNull: true,
    get() {
        const rawValue = this.getDataValue('productContext');
        return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
        if(value) this.setDataValue('productContext', JSON.stringify(value));
    }
  }
});

module.exports = Message;