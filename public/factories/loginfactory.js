module.factory('LoginFactory',['$resource','$location','$rootScope',function($resource,$location,$rootScope){
    
    var factory = {};
    
    factory.userLogin = function(userData){   
        $resource('/app/login',{},{post:{method:'POST'}}).post(userData).$promise.then(function(){
            $location.path('/user');
        });
    }
    
    factory.userRegister = function(userData){
        return $resource('/app/register',{},{post:{method:'POST'}}).post(userData).$promise;
    }
    
    return factory;
}]);