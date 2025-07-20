const express = require('express');

function initLogRouter({ logger }) {
  const router = express.Router();
  router.post('/log', (req, res) => {
    const { level, message, ...meta } = req.body;
    if (!level || !message) {
      return res.status(400).json({ error: 'Поля level и message обязательны' });
    }
    logger.log({ level, message, meta });
    res.sendStatus(204);
  });
  return router;
}

module.exports = { initLogRouter };
