const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('principal', { title: 'Principal' });
});

module.exports = router;
