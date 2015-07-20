angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
    $scope.query = {};
    $scope.query.text = "";

    $scope.newNote = {};

    $scope.save = function(note) {
        data_pt_1 = {'datum': ''};
        data_pt_2 = {'datum': ''};
        data_pt_3 = {'datum': ''};
        data_pts = [data_pt_1,data_pt_2,data_pt_3];
        $http.post('https://togoogle-backend.herokuapp.com/notes/update_note/', {'username': 'test_user', password: 'testpassword', 'is_new_note': true, 'title': $scope.query.text, summary: '', data_points: data_pts}).success(function(data, status, headers, config) {
            console.log(config);
            console.log(data);
        }).error(function(data, status, headers, config) {
            console.log(config);
            console.log(data);
        });
    }
})

.controller('NotesCtrl', function($scope, $http) {
    $http.post('https://togoogle-backend.herokuapp.com/notes/', {'username': 'test_user', password: 'testpassword'}).success(function(data, status, headers, config) {
           Notes = data['notes'];
           $scope.notes = Notes;
       }).error(function(data, status, headers, config) {
           console.log(config);
           console.log(data);
       });
})

.controller('NoteDetailCtrl', function($scope, $stateParams, Notes, $sce, $http) {
    $scope.note = {};
      $http.post('https://togoogle-backend.herokuapp.com/notes/single/', {'username': 'test_user', password: 'testpassword', 'note_id': $stateParams.noteId}).success(function(data, status, headers, config) {
          $scope.note = data;
          console.log(data);
          if (data['data_points'][0]) {
              $scope.note.fact1 = data['data_points'][0]['datum'];
              $scope.note.fact1_data = data['data_points'][0];
          } else {
              $scope.note.fact1 = '';
              $scope.note.fact1_data = data['data_points'][0];
          }
          if (data['data_points'][1]) {
              $scope.note.fact2 = data['data_points'][1]['datum'];
              $scope.note.fact2_data = data['data_points'][1];
          } else {
              $scope.note.fact2 = '';
              $scope.note.fact2_data = data['data_points'][1];
          }
          if (data['data_points'][2]) {
              $scope.note.fact3 = data['data_points'][2]['datum'];
              $scope.note.fact3_data = data['data_points'][2];
          } else {
              $scope.note.fact3 = '';
              $scope.note.fact3_data = data['data_points'][2];
          }
      }).error(function(data, status, headers, config) {
          console.log(config);
          console.log(data);
      });

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
