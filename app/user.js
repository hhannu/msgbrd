var express = require('express');
var passport = require('../server').passport;
var router = express.Router();


router.post('/login', passport.authenticate('local-login'),function(req,res){
    res.send({name:req.user.name});
});

router.post('/register',function(req,res){
    req.queries.registerUser(req,res);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/', function(req, res) {
    req.queries.getRecentMessages(req,res);
});

router.get('/messages', function(req, res) {
    req.queries.getAllMessages(req,res);
});

router.get('/filters',function(req,res){
    req.queries.getFilters(req,res);
});

router.get('/search', function(req, res) {
    req.queries.getMessages(req,res);
});

module.exports = router;