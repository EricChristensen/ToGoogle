angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $sce, $http, Notes, Globals) {
    $scope.query = {};
    $scope.query.text = "";

    $scope.search = function() {
        $scope.query.currentURL = $sce.trustAsResourceUrl('https://duckduckgo.com/?q='+ $scope.query.text +'&kp=-1&kl=us-en');
    }

    $scope.newNote = {};

    $scope.save = function(note) {
        data_pt_1 = {'datum': $scope.newNote.fact1};
        data_pt_2 = {'datum': $scope.newNote.fact2};
        data_pt_3 = {'datum': $scope.newNote.fact3};
        data_pts = [data_pt_1,data_pt_2,data_pt_3];
        $http.post(Globals.backendHostName() + 'notes/update_note/', {'username': 'test_user', password: 'testpassword', 'is_new_note': true, 'title': $scope.query.text, summary: $scope.newNote.summary, data_points: data_pts}).success(function(data, status, headers, config) {
            console.log(config);
            console.log(data);
        }).error(function(data, status, headers, config) {
            console.log(config);
            console.log(data);
        });
    }

})

.controller('NotesCtrl', function($scope, Notes, $http, Globals) {
    $http.post(Globals.backendHostName() + 'notes/', {'username': 'test_user', password: 'testpassword'}).success(function(data, status, headers, config) {
        Notes = data['notes'];
        $scope.notes = Notes;
    }).error(function(data, status, headers, config) {
        console.log(config);
        console.log(data);
    });

})

.controller('NoteDetailCtrl', function($scope, $stateParams, Notes, Globals, $sce, $http) {
    $scope.note = {};
    $http.post(Globals.backendHostName() + 'notes/single/', {'username': 'test_user', password: 'testpassword', 'note_id': $stateParams.noteId}).success(function(data, status, headers, config) {
        $scope.notey = data;
        console.log(data);
        $scope.note.currentURL = $sce.trustAsResourceUrl('https://duckduckgo.com/?q='+ data['title'] +'&kp=-1&kl=us-en');
        if (data['data_points'][0]) {
            $scope.notey.fact1 = data['data_points'][0]['datum'];
            $scope.notey.fact1_data = data['data_points'][0];
        } else {
            $scope.notey.fact1 = '';
            $scope.notey.fact1_data = data['data_points'][0];
        }
        if (data['data_points'][1]) {
            $scope.notey.fact2 = data['data_points'][1]['datum'];
            $scope.notey.fact2_data = data['data_points'][1];
        } else {
            $scope.notey.fact2 = '';
            $scope.notey.fact2_data = data['data_points'][1];
        }
        if (data['data_points'][2]) {
            $scope.notey.fact3 = data['data_points'][2]['datum'];
            $scope.notey.fact3_data = data['data_points'][2];
        } else {
            $scope.notey.fact3 = '';
            $scope.notey.fact3_data = data['data_points'][2];
        }
    }).error(function(data, status, headers, config) {
        console.log(config);
        console.log(data);
    });



    $scope.save = function(note) {
        $scope.notey.fact1_data['datum'] = $scope.notey.fact1;
        new_data_points = [$scope.notey.fact1_data];
        if ($scope.notey.fact2_data) {
            $scope.notey.fact2_data['datum'] = $scope.notey.fact2;
            new_data_points.push($scope.notey.fact2_data);
        }
        if ($scope.notey.fact2_data) {
            $scope.notey.fact3_data['datum'] = $scope.notey.fact3;
            new_data_points.push($scope.notey.fact3_data);
        }
        $http.post(Globals.backendHostName() + 'notes/update_note/', {'username': 'test_user', password: 'testpassword', 'note_id': $stateParams.noteId, 'is_new_note': false, 'title': '$scope.notey.title', summary: $scope.notey.summary, data_points: new_data_points}).success(function(data, status, headers, config) {
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
})

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $http, Globals) {
    $scope.data = {};

    $scope.login = function() {
	$http.post(Globals.backendHostName() + 'login/', {'username': $scope.data.username, 'password': $scope.data.password}).
	    success(function(data, status, headers, config) {
		if (data['success']){
		    $state.go('tab.dash');
		}
		else {
		    var alertPopup = $ionicPopup.alert({
			title: 'Login failed!',
			template: 'Please check your credentials!'
		    });
		}
	    }).error(function(data, status, headers, config){
		var alertPopup = $ionicPopup.alert({
		    title: 'Login failed!',
		    template: 'Could not connect to login service!'
		});		
	    });
    };

})
