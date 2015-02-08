module.factory('SocketFactory',['$resource', '$location', function($resource, $location){
    
    var factory = {};

    // client socket
    var socket = io();
    
    factory.notify;
    
    socket.on('broadcast_msg', function(data){
        factory.notify(data);
    });
    
    factory.sendMessage = function(data){
        socket.emit('new_message', data);
    };
   
    factory.getRecentMessages = function(){
        return $resource('/app').get().$promise;
    };
    
    factory.getAllMessages = function(){
        return $resource('/app/messages').get().$promise;
    };
    
    factory.getMessages = function(filter){
        return $resource('/app/search', {id:filter}).get().$promise;        
    };
    
    factory.newMessage= function(){
        $location.path('/user');
    };
    
    factory.showMessages = function() {
        $location.path('/showall');
    };
    
    factory.getFilters = function(){
        return $resource('/app/filters').get().$promise;
    };
    
    return factory;
}]);