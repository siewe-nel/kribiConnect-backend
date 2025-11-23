const { sequelize } = require('../config/db');
const User = require('./User');
const Service = require('./Service');
const Message = require('./Message');
const Review = require('./Review');

// Services
User.hasMany(Service, { foreignKey: 'providerId', as: 'services' });
Service.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

// Messagerie
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// Reviews (Notations)
// Un utilisateur (client) écrit des avis
User.hasMany(Review, { foreignKey: 'reviewerId', as: 'writtenReviews' });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });

// Un utilisateur (fournisseur) reçoit des avis
User.hasMany(Review, { foreignKey: 'targetUserId', as: 'receivedReviews' });
Review.belongsTo(User, { foreignKey: 'targetUserId', as: 'targetUser' });

// Un service peut aussi recevoir des avis
Service.hasMany(Review, { foreignKey: 'serviceId', as: 'reviews' });
Review.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

module.exports = { sequelize, User, Service, Message, Review };