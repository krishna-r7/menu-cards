var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var app = express();
var bodyparser = require('body-parser')
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

mongoose.connect('mongodb://127.0.0.1:27017/menu', {
});


app.use(session({secret:' ed5527ba0a908425d21cbb21410f5cbbae0f62e94af23c3443bc8ee86b9744fbda9193a6941fc935a0f7df5d34f4f384c5f3d36ced3d1105db036d707fd3692b',
  resave:false,
  saveUninitialized:true
}));
app.use(express.static('public'));
app.use(bodyparser())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// app.use(express.urlencoded({ extended: true })); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/indexuser', indexRouter);
app.use('/indexadmin', indexRouter);



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
