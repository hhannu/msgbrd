var User = require('./database').User;
var Message = require('./database').Message;

//Use this for store new user for our application
module.exports.registerUser = function(req,res){
    
    var user = new User();
    user.name = req.body.username;
    user.password = user.generateHash(req.body.password);
    user.email = req.body.email;
    
    //Store model in database
    user.save(function(err){
        if(err){
            res.send({status:'Error'})
        }
        else{
            res.send({status:'Ok'});
        }
    });
}

module.exports.saveMessage = function(data){
    
    console.log('saveMessage: ' + data.owner);
    
    User.findOne({name: data.owner}, function(err, user){
        
        if(err || user === null) {
            console.log(err);
            return;
        }
        //console.log(user);
        var message = new Message();
        message.owner = user;
        message.subject = data.subject;
        message.text = data.text;
        message.timestamp = data.timestamp;        
        user.messages.push(message);
      
        message.save();
        user.save();
    });
}

module.exports.getRecentMessages = function(req,res){
    
    //console.log('getRecentMessages: ' + req.user.name);
    
    var options = {
        path: 'messages',
        //match: { subject: 'hello' },
        options: { limit: 5 }
    }
    
    var query = User.find({name: req.user.name}).populate(options);
    
    query.exec(function(err,data){
        //console.log(data);
        res.send(data[0]);
    });
}

module.exports.getAllMessages = function(req,res){
    
    //console.log('getAllMessages: ' + req.user.name);
    
    var options = {
        path: 'messages',
        //match: { subject: 'hello' },
        //options: { limit: 5 }
    }
    
    var query = User.find({name: req.user.name}).populate(options);
    
    query.exec(function(err,data){
        //console.log(data);
        res.send(data[0]);
    });
}

module.exports.getFilters = function(req,res){
    
    //console.log('getFilters');
    
    User.find().select('name').exec(function(err,popul){
        Message.find().select('subject').exec(function(err,messages){
            var filter = {};
            filter.names = popul;
            filter.subjects = messages;
            res.send(filter);
        });
    });
}

module.exports.getMessages = function(req,res){
    
    //console.log('getMessages: ' + req.user.name);
    var name = {};
    var query;
    
    var options = {
        path: 'messages',
        //match: { subject: 'hello' },
        //options: { limit: 5 }
    }
    //{"name":null,"match":{"subject":"x"}}
    
    var filter = JSON.parse(req.query.id);
    if(filter.name !== null)
        name = { name: filter.name };
        
    if(filter.match !== null)
        options.match = filter.match;
    
    //console.log('getMessages: ' + JSON.stringify(name) + ' ' + JSON.stringify(options));
    query = User.find(name).populate(options);
    
    query.exec(function(err,data){
        console.log('getMessages: ' + data);
        
        for(var i = 0; i < data.length; i++) {
            if(data[i].messages.length == 0) {
                data.splice(i, 1);
            }
        }
        res.send(data[0]);
    });
}

module.exports.deleteMessage = function(req,res){
    Message.findOne({_id:req.query.id}).remove().exec(function(err,done){
        res.send('deleted');
    });
}
