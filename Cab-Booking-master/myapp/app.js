var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

import config from 'config';
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

const options = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

mongoose.Promise = Promise;
// Connect to the db
mongoose.connect("mongodb://localhost:27017/ride", function (err, db) {
   
     if(err){
      throw err;
     }
     else {
       console.log('db connected')
     }                
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
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
