module.controller('LoginController',['$scope','$location','$rootScope','LoginFactory',function($scope,$location,$rootScope,LoginFactory){
    
    $('#myAlert').hide();
    $scope.user = {};
    $scope.user.showError = false;
    //This is called when login button is pressed
    $scope.user.login = function(){
        //Check the form data validity
        if(!$scope.loginForm.$valid){
           $('#myAlert').show(); 
            return;
        }
        var userData = {            
            username:$scope.user.username,
            //password:$scope.user.password
            password:sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash($scope.user.username))
        };
        
        //console.log(userData.password);
        
        //login
        LoginFactory.userLogin(userData);
    };
    
    //This is called when register button is pressed
    $scope.user.register = function(){
        
        if(!$scope.loginForm.$valid){
           $('#myAlert').show(); 
            return;
        }
        var userData = {
            username:$scope.user.username,
            password: sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash($scope.user.username)),
            //password:$scope.user.password,
            email:$scope.user.email
        };
        LoginFactory.userRegister(userData).then(function(data){
            
            if(data.status === 'Error'){
                $scope.user.showError = true;
            }
            else{
                $scope.user.showError = false;
                $scope.user.email = "";
            }
        });
    };
    
}]);