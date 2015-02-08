module.controller('MessageController',['$scope', '$resource', 'SocketFactory',function($scope, $resource, SocketFactory){
        
    $scope.message = {};
    $scope.message.messages = [];
       
    SocketFactory.getRecentMessages().then(function(data){
        $scope.message.messages = data.messages;
        $scope.message.user = data.name;
        //console.log(data);
    });

    $scope.message.send = function(){        
        //console.log($scope.message);
        
        if($scope.message.subject === '' && $scope.message.text === '')
            return; 

        var message = {};
        message.owner = $scope.message.user;
        message.subject = $scope.message.subject;
        message.text = $scope.message.text;
        message.timestamp = new Date();
        SocketFactory.sendMessage(message);
        
        //clear input
        $scope.message.subject = '';
        $scope.message.text = '';
        
    }; 
    
    $scope.showAll = function() { SocketFactory.showMessages(); };
        
    SocketFactory.notify = function(data){
        //console.log('received: ' + data);
        $scope.message.messages.push(data);
        
        $scope.$apply();
        // or: 
        //$('#list').append($compile('<h4>{{message.messages[0].subject}}</h4><p>{{message.messages[0].text}}</p>'));
    };
}]);