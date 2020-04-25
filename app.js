/** @file An ExpressJS web app that allows users to book appointments with each other using Google Calendar API data 
 * @author Denis Komarov <dkomarov@hawk.iit.edu>
 * @author Dhiraj Jain <djain14@hawk.iit.edu> 
 * @author Jimmy Tran <jtran8@hawk.iit.edu>
 * @copyright Denis Komarov, Dhiraj Jain, and Jimmy Tran
 * @license 
 * Copyright 2020 by Denis Komarov, Dhiraj Jain, and Jimmy Tran
 * 
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the 
 * above copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF 
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY 
 * DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, 
 * ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
'use strict';

const cookieSession = require('cookie-session');
const createError = require('http-errors');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const keys = require('./config/keys');
const logger = require('morgan');
const menuRoutes = require('./routes/menu');
const mongodb = require('./lib/connect');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const path = require('path');
const usersRouter = require('./routes/users');
const authRoutes = require('./routes/auth-routes');
const appointmentRoutes = require('./routes/appointment-routes');

/**
 * @description Connects the application to mongoDB Database
 */
mongodb.dbConnect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.set(passportSetup);

app.use(cookieSession({
  maxAge:24 * 60 * 60 *1000,
  keys:[keys.session.cookieKey]
}));

/**
 * @description Initialise the passport
 */
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/auth',authRoutes);
app.use('/menu', menuRoutes);
app.use('/appointment',appointmentRoutes);
app.use('/appointment/appt-success', appointmentRoutes);
app.use('/appointment/view-appointment',appointmentRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
