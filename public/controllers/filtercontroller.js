module.controller('FilterController',['$scope', '$resource', 'SocketFactory', function($scope, $resource, SocketFactory){
        
    $scope.message = {};
    $scope.message.messages = [];
    $scope.inverted = false;
    
    $scope.filter = {};
    
    SocketFactory.getFilters().then(function(data){
        $scope.filter.names = data.names;
        $scope.filter.subjects = data.subjects;
        //console.log(data);
    });
    
    SocketFactory.getAllMessages().then(function(data){
        $scope.message.messages = data.messages;
        $scope.message.user = data.name;
        $scope.message.id = data._id;
        //console.log(data);
    });
    
    $scope.newMessage = function() { SocketFactory.newMessage(); };
    
    $scope.filterMessages = function() { 
        var query = {};
        
        if($scope.byname !== undefined && $scope.byname !== null) {
            query.name = $scope.byname;
        }
        else {
            query.name = null;
        }
        if($scope.bysubject !== undefined && $scope.bysubject !== null) {
            query.match = { subject: $scope.bysubject };
        }
        else {
            query.match = null;            
        }
        
        //console.log('filterMessages' + JSON.stringify(query));
        
        if(query.name === null && query.match === null)
            SocketFactory.getAllMessages().then(function(data){
                $scope.message.messages = data.messages;
                $scope.message.user = data.name;
                //$scope.message.id = data._id;
                //console.log(data);
            });
        else
            SocketFactory.getMessages(query).then(function(data){
                //console.log(JSON.stringify(data));
                if(data.messages === 'undefined') {
                    $scope.message.messages = [];
                }
                else
                    $scope.message.messages = data.messages;
                $scope.message.user = data.name;
                //$scope.message.id = data._id;
            });
    };
    
    $scope.deleteMessage = function(index) {
        var id = $scope.message.messages[index]._id;
        
        $scope.message.messages.splice(index, 1);
        
        SocketFactory.deleteMessage(id).then(function(data){
            console.log(data);
        });        
    };
    
    $scope.invert = function() {
        $scope.inverted = !$scope.inverted;
        $scope.message.messages.reverse();
    }
}]);