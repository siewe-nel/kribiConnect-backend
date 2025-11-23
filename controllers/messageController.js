const { Message, User } = require('../models/Index');
const { Op } = require('sequelize');

// Helper statut en ligne
const isUserOnline = (lastSeenDate) => {
    if (!lastSeenDate) return false;
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    return new Date(lastSeenDate) > twoMinutesAgo;
};

exports.getConversations = async (req, res) => {
    const { userId } = req.params;
    try {
        const messages = await Message.findAll({
            where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] },
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'avatar', 'lastSeen'] },
                { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar', 'lastSeen'] }
            ]
        });

        const contactMap = new Map();
        messages.forEach(msg => {
            const isSender = msg.senderId === parseInt(userId);
            const partner = isSender ? msg.receiver : msg.sender;
            
            if (partner && !contactMap.has(partner.id)) {
                contactMap.set(partner.id, {
                    id: partner.id,
                    name: partner.name,
                    avatar: partner.avatar,
                    lastMessage: msg.content.startsWith('FILE:') ? 'Pièce jointe' : msg.content,
                    lastMessageDate: msg.createdAt,
                    isOnline: isUserOnline(partner.lastSeen)
                });
            }
        });
        res.json(Array.from(contactMap.values()));
    } catch (error) { res.status(500).json({ error: "Erreur contacts" }); }
};

exports.getConversation = async (req, res) => {
  const { userId1, userId2 } = req.params;
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }
        ]
      },
      order: [['createdAt', 'ASC']], 
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] }]
    });
    
    const partner = await User.findByPk(userId2, { attributes: ['lastSeen'] });
    
    res.json({ 
        messages, 
        partnerOnline: partner ? isUserOnline(partner.lastSeen) : false 
    });
  } catch (error) { res.status(500).json(error); }
};

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content, productContext } = req.body;
    let finalContent = content || '';

    // Cloudinary : req.file.path contient l'URL HTTPS directe
    if (req.file) {
        console.log('Fichier Cloudinary :', req.file.path);
        finalContent = `FILE:${req.file.path}`;
    }

    let parsedContext = null;
    if (productContext) {
        try { parsedContext = JSON.parse(productContext); } catch(e) { parsedContext = productContext; }
    }

    const newMessage = await Message.create({
        senderId, receiverId, 
        content: finalContent,
        productContext: parsedContext, 
        isRead: false
    });
    res.status(201).json(newMessage);
  } catch (error) { res.status(500).json(error); }
};