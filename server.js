var express = require('express');
var bodyParser = require('body-parser');
//These are needed for passport
var session = require('express-session');
var passport = require('passport');
module.exports.passport = passport;

//Initialize our passport
require('./app/passport')(passport); 

var user = require('./app/user');
var queries = require('./app/queries');

var app = express();
// needed for sockets
var server = require('http').Server(app);
var io = require('socket.io')(server);

//This middleware is called for every request
app.use(function(req,res,next){
    //Store queries object to request
    req.queries = queries;
    req.passport = passport;
    //Pass to next middleware
    next();    
});

//Point static files to public folder
app.use('/',express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(session({secret: '5cc67ba0-333d-4008-84db-aa5c2c50f5e1', saveUninitialized: true, resave: true, cookie:{ maxAge:100000} }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/app', user);

app.get('/authenticate',function(req,res){
    if(req.user){
        res.send({authenticated:true});
    }
    else{
        res.send({authenticated:false});
    }    
});

app.get('/*',function(req,res){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    socket.on('new_message', function(data){
        //console.log(data);
        queries.saveMessage(data);
        io.emit('broadcast_msg', data);
    });
});

//app.listen(3000);
server.listen(3000);
