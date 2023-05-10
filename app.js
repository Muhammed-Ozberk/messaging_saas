const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

/** Middleware Import */
const responseMiddleware = require('./middlewares/responses');
const responseErrorMiddleware = require('./middlewares/responseErrors');
/** Middleware Import END */

/* Routes Import */
const authRouter = require('./routes/authRouter');
const homeRouter = require('./routes/homeRouter');
const apiRouter = require('./routes/apiRouter');
/* Routes Import END */

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

/** Middleware */
app.use(responseMiddleware);
app.use(responseErrorMiddleware);
/** Middleware END */

/** Routes */
app.use('/', authRouter);
app.use('/home', homeRouter);
app.use('/api', apiRouter);
app.use('/api-docs', swaggerUi.serve);
app.use('/api-docs', swaggerUi.setup(swaggerDocument));
/** Routes END */

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
