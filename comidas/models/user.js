const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  cedula: { type: String, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  telefono: { type: String, required: true },
  correo: { type: String, required: true },
  usuario: { type: String, required: true },
  contrasenia: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
