var module = angular.module('MsgBrd',['ngRoute', 'ngResource', 'ngAnimate', 'ngCookies']);

module.config(function($routeProvider, $locationProvider){
    
    $locationProvider.html5Mode(true);
    
    $routeProvider.when('/',{
        templateUrl:'partials/login.html',
        controller:'LoginController'
    });
    
    $routeProvider.when('/user',{
        templateUrl:'partials/userdata.html',
        controller:'MessageController',
        resolve:{loginRequired:loginRequired}
    });
    
    $routeProvider.when('/showall',{
        templateUrl:'partials/messages.html',
        controller:'FilterController',
        resolve:{loginRequired:loginRequired}
    });
    
    $routeProvider.otherwise({redirectTo: '/'});
});

function loginRequired($location, $resource, $q, $rootScope){
 
    var deferred = $q.defer();
    
    $resource('/authenticate').get().$promise.then(function(auth){
        
        if(auth.authenticated){
            deferred.resolve();
        }
        else{
            deferred.reject();
            $location.path('/');
        }
    });
    
    return deferred.promise;   
}

