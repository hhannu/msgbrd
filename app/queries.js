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
        message.sender = data.sender;
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
        path: 'sender',
        //match: { subject: 'hello' },
        options: { limit: 5, sort:{timestamp: -1}}
    }
    
    var data = {name: req.user.name, messages: []};
    
    Message.find({}).limit(5).sort('-timestamp').exec(function(err,msgs){
        data.messages = msgs;
        console.log(data);
        res.send(data);
    });
//    var query = User.find({name: req.user.name}).populate(options);
//    
//    query.exec(function(err,data){
//        //console.log(data);
//        res.send(data[0]);
//    });
}

module.exports.getAllMessages = function(req,res){
    
    //console.log('getAllMessages: ' + req.user.name);
    
    var options = {
        path: 'messages',
        //match: { subject: 'hello' },
        //options: { limit: 5 }
    }
    
    var query = User.find({}).populate(options);
    
    query.exec(function(err,data){
        //console.log('getAllMessages: ' +data);
        var users = { name: req.user.name, messages: []};
        
        for(var i = 0; i < data.length; i++)            
            users.messages = users.messages.concat(data[i].messages);
        
        // delete empty messages
        for(var i = 0; i < users.messages.length; i++)            
            if(users.messages[i] === null)
                users.messages.splice(i, 1);
        
        //console.log('getAllMessages: ' + users.messages);
                
        // sort by timestamp
        users.messages.sort(function(a, b){
            return b.timestamp - a.timestamp;
        });
        
        res.send(users);
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
        var users = {name: req.user.name, messages: []};
        
        for(var i = 0; i < data.length; i++) {
            users.messages = users.messages.concat(data[i].messages);
        }      
        // delete empty messages
        for(var i = 0; i < users.messages.length; i++)            
            if(users.messages[i] === null)
                users.messages.splice(i, 1);  
        
        // sort by timestamp
        users.messages.sort(function(a, b){
            return b.timestamp - a.timestamp;
        });
        
        res.send(users);
    });
}

module.exports.deleteMessage = function(req,res){
    Message.findOne({_id:req.query.id}).remove().exec(function(err,done){
        res.send('deleted');
    });
    
    console.log(req.query.id); 
    User.findOne({name: req.user.name}, function(err, user){
        if(user.messages !== null) {
            for(var i = 0; i < user.messages.length; i++) {
                
                console.log(user.messages[i]);
                if(user.messages[i] == req.query.id)
                    user.messages.splice(i, 1);
            }
            user.save();  
            console.log(user.messages);          
        }    
    });
}
