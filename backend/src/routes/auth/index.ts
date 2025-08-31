const { Router } = require('express');

const router = Router();

// TODO: Implement auth routes
router.get('/', (req, res) => {
  res.json({ message: 'Auth routes - Coming soon!' });
});

module.exports = router;

