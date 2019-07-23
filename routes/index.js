var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if(req.isAuthenticated())
    res.render('index', { username: req.user.displayName, first: req.user.firstName, last: req.user.lastName, mail: req.user.email, addressDetails: req.user.address });
  else
   res.render('index', { username: null});
});

module.exports = router;