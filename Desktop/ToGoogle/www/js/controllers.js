angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $sce, $http, Notes) {
    $scope.query = {};
    $scope.query.text = "";

    $scope.search = function() {
        $scope.query.currentURL = $sce.trustAsResourceUrl('https://duckduckgo.com/?q='+ $scope.query.text +'&kp=-1&kl=us-en');
    }

    $scope.newNote = {};
    $scope.newNote.facts = []

    $scope.save = function(note) {
        /*data_pt_1 = {'datum': $scope.newNote.facts[0]};
        data_pt_2 = {'datum': $scope.newNote.facts[1]};
        data_pt_3 = {'datum': $scope.newNote.facts[2]};*/
	data_pts = []
	$scope.newNote.facts.map(function(fact, rank){
	    data_pts.push(fact);
	});
        //data_pts = [data_pt_1,data_pt_2,data_pt_3];
        $http.post('https://togoogle-backend.herokuapp.com/notes/update_note/', {'username': 'test_user', password: 'testpassword', 'is_new_note': true, 'title': $scope.query.text, summary: $scope.newNote.summary, data_points: data_pts}).success(function(data, status, headers, config) {
            console.log(config);
            console.log(data);
        }).error(function(data, status, headers, config) {
            console.log(config);
            console.log(data);
        });
    }

})

.controller('NotesCtrl', function($scope, Notes, $http) {
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
        $scope.notey = data;
        console.log(data);
        $scope.note.currentURL = $sce.trustAsResourceUrl('https://duckduckgo.com/?q='+ data['title'] +'&kp=-1&kl=us-en');
	$scope.notey.facts = [];
	//$scope.notey.facts[0] = "adf";
	//$scope.notey.facts[1] = "adf";
	//$scope.notey.facts[2] = "adf";
	if (data['data_points'][0]) {
            $scope.notey.facts[0]/*1*/ = data['data_points'][0]['datum'];
            $scope.notey.fact1_data = data['data_points'][0];
        } else {
            $scope.notey.facts[0]/*1*/ = '';
            $scope.notey.fact1_data = data['data_points'][0];
        }
        if (data['data_points'][1]) {
            $scope.notey.facts[1]/*2*/ = data['data_points'][1]['datum'];
            $scope.notey.fact2_data = data['data_points'][1];
        } else {
            $scope.notey.facts[1]/*2*/ = '';
            $scope.notey.fact2_data = data['data_points'][1];
        }
        if (data['data_points'][2]) {
            $scope.notey.facts[2]/*3*/ = data['data_points'][2]['datum'];
            $scope.notey.fact3_data = data['data_points'][2];
        } else {
            $scope.notey.facts[2]/*3*/ = '';
            $scope.notey.fact3_data = data['data_points'][2];
        }
    }).error(function(data, status, headers, config) {
        console.log(config);
        console.log(data);
    });



    $scope.save = function(note) {
        $scope.notey.fact1_data['datum'] = $scope.notey.facts[0]/*1*/;
        new_data_points = [$scope.notey.fact1_data];
        if ($scope.notey.fact2_data) {
            $scope.notey.fact2_data['datum'] = $scope.notey.facts[1]/*2*/;
            new_data_points.push($scope.notey.fact2_data);
        }
        if ($scope.notey.fact2_data) {
            $scope.notey.fact3_data['datum'] = $scope.notey.facts[2]/*3*/;
            new_data_points.push($scope.notey.fact3_data);
        }
        $http.post('https://togoogle-backend.herokuapp.com/notes/update_note/', {'username': 'test_user', password: 'testpassword', 'note_id': $stateParams.noteId, 'is_new_note': false, 'title': '$scope.notey.title', summary: $scope.notey.summary, data_points: new_data_points}).success(function(data, status, headers, config) {
            console.log(config);
            console.log(data);
        }).error(function(data, status, headers, config) {
            console.log(config);
            console.log(data);
        });
    }

})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
