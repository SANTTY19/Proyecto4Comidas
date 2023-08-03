const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model or adjust the path based on your project structure

// GET request handler to render the "Mi Cuenta" page
router.get('/', function(req, res, next) {
  res.render('micuenta', { title: 'Mi Cuenta' });
});

// POST request handler to handle form submission
router.post('/', async function(req, res, next) {
  const cedula = req.body.cedula; // Get the cedula value from the form submission

  try {
    // Find the user with the given cedula in the database
    const user = await User.findOne({ cedula: cedula });

    if (!user) {
      // If the user is not found, set an error message
      const errorMessage = 'Usuario no encontrado';
      res.render('micuenta', { title: 'Mi Cuenta', errorMessage: errorMessage });
    } else {
      // If the user is found, render the user data
      res.render('micuenta', { title: 'Mi Cuenta', user: user });
    }
  } catch (err) {
    next(err); // Pass any error to the error handler
  }
});

module.exports = router;
