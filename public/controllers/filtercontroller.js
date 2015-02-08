module.controller('FilterController',['$scope', '$resource', 'SocketFactory', function($scope, $resource, SocketFactory){
        
    $scope.message = {};
    $scope.message.messages = [];
    
    $scope.filter = {};
    
    SocketFactory.getFilters().then(function(data){
        $scope.filter.names = data.names;
        $scope.filter.subjects = data.subjects;
        console.log(data);
    });
    
    SocketFactory.getAllMessages().then(function(data){
        $scope.message.messages = data.messages;
        $scope.message.user = data.name;
        //console.log(data);
    });
    
    $scope.newMessage = function() { SocketFactory.newMessage(); };
    
}]);