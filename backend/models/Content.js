const db = require('../config/db');

class Content {
  static async getDocuments() {
    const [results] = await db.query('CALL get_documents_view()');
    return results[0];
  }

  static async getNotifications() {
    const [results] = await db.query('CALL get_notifications_view()');
    return results[0];
  }

  static async create(type, { title, content, docType, authorId }) {
    if (type === 'DOCUMENT') {
      return await db.query(
        'CALL create_document(?, ?, ?, ?)', 
        [title, content, docType || 'BCN_BYLAW', authorId]
      );
    } else {
      return await db.query(
        'CALL create_notification(?, ?, ?)',
        [title, content, authorId]
      );
    }
  }

  static async updateDocument(id, { title, content, docType }) {
    const [results] = await db.query('CALL update_document(?, ?, ?, ?)', [id, title, content, docType]);
    return results[0][0];
  }

  static async updateNotification(id, { title, content }) {
    const [results] = await db.query('CALL update_notification(?, ?, ?)', [id, title, content]);
    return results[0][0];
  }
}

module.exports = Content;