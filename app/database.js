var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// default to a 'localhost' configuration:
var connection_string = 'mongodb://127.0.0.1:27017/msgbrd';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(connection_string,function(err,success){
    
    if(err){
        console.log(err + "check that mongodb is running.");
    }
    else{
        console.log('connected to database');
    }
});

var Schema = mongoose.Schema;

var user = new Schema({
    name: {type: String, unique: true},
    password: String,
    email: String,
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
});

user.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

user.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', user);

module.exports.User = User;


var message = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    subject: {type: String, min: 3},
    text: String,
    timestamp: Date
});

var Message = mongoose.model('Message', message);

module.exports.Message = Message;