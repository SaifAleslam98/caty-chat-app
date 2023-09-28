var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const expressHbs = require('express-handlebars')
var logger = require('morgan');
const dbConnection = require('./config/database');
var indexRouter = require('./routes/usersRoute');
var authRouter = require('./routes/authRoute');
const dotenv = require('dotenv');

dotenv.config({ path: 'config.env' });

var app = express();
dbConnection();

// view engine setup
app.engine('.hbs', expressHbs.engine({defaultLayout:'layout', extname:'.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);

app.all('*', (req, res, next) => {
  res.status(400).send(`Cannot Get ${req.originalUrl}`)
})
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
