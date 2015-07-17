angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $sce, $http, Notes) {

    $scope.query = {};
    $scope.query.text = "";

    $scope.search = function() {
        $scope.query.currentURL = $sce.trustAsResourceUrl('https://duckduckgo.com/?q='+ $scope.query.text +'&kp=-1&kl=us-en');
    }

    $scope.newNote = {};
    $scope.newNote.id = 2;

    $scope.save = function(note) {
        $scope.newNote.name = $scope.query.text;
        Notes.add(note);
    }


    $http.get('http://togoogle-backend.herokuapp.com/notes/', {'username': 'test_user', 'password': 'testpassword'}).success(function(data, status, headers, config) {
        console.log(data);
    }).error(function(data, status, headers, config) {

    });
})

.controller('NotesCtrl', function($scope, Notes) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.notes = Notes.all();
  $scope.remove = function(note) {
    Notes.remove(note);
  }
})

.controller('NoteDetailCtrl', function($scope, $stateParams, Notes, $sce) {
  $scope.notey = Notes.get($stateParams.noteId);

  $scope.note = {};
  $scope.note.name = "Grant Isom";
  $scope.note.currentURL = $sce.trustAsResourceUrl('https://duckduckgo.com/?q='+ $scope.notey.name +'&kp=-1&kl=us-en');

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
