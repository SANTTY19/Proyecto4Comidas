const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Ruta GET para mostrar el formulario de registro
router.get('/', (req, res) => {
  res.render('registro');
});

// Ruta POST para manejar el registro del usuario
router.post('/', async (req, res, next) => {
  try {
    const { cedula, nombre, apellido, telefono, correo, usuario, contrasenia } = req.body;

    // Verificar si el usuario ya existe en la base de datos por su número de cédula o nombre de usuario
    const existingUser = await User.findOne({ $or: [{ cedula: cedula }, { usuario: usuario }] });

    if (existingUser) {
      // Si el usuario ya existe, mostrar un mensaje de error
      res.render('registro', { message: 'El usuario ya existe. Inténtalo nuevamente.' });
    } else {
      // Si el usuario no existe, crear un nuevo documento del modelo User con los detalles del usuario
      const newUser = new User({
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        correo: correo,
        usuario: usuario,
        contrasenia: contrasenia,
      });

      // Guardar el nuevo usuario en la base de datos
      await newUser.save();

      // Redirigir al usuario a la página de inicio de sesión después del registro exitoso
      res.redirect('/');
    }
  } catch (err) {
    next(err); // Pasa cualquier error al manejador de errores
  }
});

module.exports = router;
