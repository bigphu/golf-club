const Content = require('../models/Content');

exports.getDocuments = async (req, res) => {
  try {
    const docs = await Content.getDocuments();
    res.json(docs);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifs = await Content.getNotifications();
    res.json(notifs);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createContent = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admins only' });

    const { type, ...data } = req.body;
    await Content.create(type, { ...data, authorId: req.user.id });
    
    res.json({ message: 'Content created successfully' });
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.updateContent = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admins only' });
    const { id } = req.params;
    const { type, ...data } = req.body;

    let updated;
    if (type === 'DOCUMENT') {
      updated = await Content.updateDocument(id, data);
    } else {
      updated = await Content.updateNotification(id, data);
    }
    res.json({ message: 'Updated successfully', data: updated });
  } catch (error) { res.status(400).json({ error: error.message }); }
};