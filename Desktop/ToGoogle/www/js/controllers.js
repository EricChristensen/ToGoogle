angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $sce) {
    $scope.note = {};
    $scope.note.name = "Grant Isom";
    $scope.note.currentURL = $sce.trustAsResourceUrl('https://duckduckgo.com/?q='+ $scope.note.name +'&kp=-1&kl=us-en');
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
  $scope.note = Notes.get($stateParams.noteId);

  $scope.note.name = "tacos"
  $scope.currentURL = $sce.trustAsResourceUrl('https://duckduckgo.com/?q='+ encodeURI($scope.note.name) +'&kp=-1&kl=us-en');

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
