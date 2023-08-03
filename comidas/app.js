// app.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const createError = require('http-errors');

// Configurar la conexión a MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/Comidas';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conexión exitosa a MongoDB'))
.catch((err) => console.error('Error al conectar a MongoDB:', err));

mongoose.connection.on('error', (err) => {
  console.error('Error en la conexión a MongoDB:', err);
});

// Importar los modelos User y Product
const User = require('./models/user');
const Product = require('./models/product');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const registroRouter = require('./routes/registro');
const principalRouter = require('./routes/principal');
const loginRouter = require('./routes/login');
const micuentaRouter = require('./routes/micuenta');
const misproductosRouter = require('./routes/misproductos');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/registro', registroRouter);
app.use('/principal', principalRouter);
app.use('/login', loginRouter);
app.use('/misproductos', misproductosRouter);
app.use('/micuenta', micuentaRouter);

// Ruta POST para manejar el inicio de sesión
app.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Realiza una búsqueda en la base de datos para verificar las credenciales del usuario
    const user = await User.findOne({ usuario: username, contrasenia: password });

    if (!user) {
      // Si no se encuentra el usuario o las credenciales no coinciden, redirige al formulario de inicio de sesión con un mensaje de error
      res.render('login', { message: 'Credenciales inválidas. Inténtalo nuevamente.' });
    } else {
      // Si las credenciales son válidas, redirige a la página principal
      res.redirect('/principal');
    }
  } catch (err) {
    next(err); // Pasa cualquier error al manejador de errores
  }
});

// Ruta POST para guardar los detalles del producto
app.post('/guardar-producto', async (req, res, next) => {
  try {
    const { nombre, precio, orden } = req.body;

    // Crear un nuevo documento del modelo Product con los detalles del producto
    const product = new Product({
      name: nombre,
      price: precio,
      orderNumber: orden,
    });

    // Guardar el producto en la base de datos
    await product.save();

    // Responder con un mensaje de éxito o cualquier otra información necesaria
    res.json({ message: 'Producto guardado exitosamente.' });
  } catch (err) {
    next(err); // Pasa cualquier error al manejador de errores
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
