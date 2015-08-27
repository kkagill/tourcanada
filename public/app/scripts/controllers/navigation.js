angular.module('socialdriveApp')
  .controller('NavigationCtrl', function ($scope, $location) {
    if (Parse.User.current())
        $scope.loggedIn = true;

    $scope.logout = function() {
        Parse.User.logOut();
        $scope.loggedIn = false;
        $location.path('/');
    };
    
    $scope.openLoginModal = function() {
        $scope.wrongInfo = false;
        $('#login-dialog').modal('show');
    };
    
    $scope.openSignUpModal = function(){
        $('#signup-dialog').modal('show');
    }

    $scope.loginClicked = function(){
        Parse.User.logIn($scope.username, $scope.password, {
          success: function(user) {
            // Do stuff after successful login.
            $scope.$apply(function(){
                $('#login-dialog').modal('hide');
                $scope.loggedIn = true;
                $location.path('/me');
            });
          },
          error: function(user, error) {
            $scope.$apply(function(){
                $scope.wrongInfo = true;
            });
          }
        });        
    };
    
    $scope.signupClicked = function() {
        var user = new Parse.User();
        user.set("username", $scope.username);
        user.set("password", $scope.password);
        user.set("email", $scope.email);
        
        user.signUp(null, {
          success: function(user) {
            // Hooray! Let them use the app now.
            $scope.$apply(function(){
                $('#signup-dialog').modal('hide');
                $scope.loggedIn = true;
                $location.path('/me');
            });
          },
          error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            alert("Error: " + error.code + " " + error.message);
          }
        });
    }
  });