var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var http = require('http');
var https = require('https');
var forceSsl = require('express-force-ssl');
var fs = require('fs');

var SamlStrategy = require('passport-saml').Strategy;
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://login.microsoftonline.com/330f1444-bbc3-4c2e-b0a5-1f743d7b998a/saml2',
    issuer: 'mytestapp',
    cert: fs.readFileSync('MyTestApp.pem', 'utf-8'),
    signatureAlgorithm: 'sha256'
  },
  function(profile, done) {
    console.log(profile)
    return done(null,
    {
      id: profile['nameID'],
      email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
      firstName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
      lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
      address: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/objectid']
    });
  })
);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(443, () => {
  console.log('Listening...')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(
  {
    resave: true,
    saveUninitialized: true,
    secret: 'bigoof'
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users); 

app.get('/login',
  passport.authenticate('saml', {
    successRedirect: '/',
    failureRedirect: '/login' })
  );
app.post('/login/callback',
  passport.authenticate('saml', {
    failureRedirect: '/',
    failureFlash: true }),
  function(req, res) {
    res.redirect('/');
    console.log(req.sessionID)
  }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

http.createServer(app).listen(80);
app.use(forceSsl);


module.exports = app;