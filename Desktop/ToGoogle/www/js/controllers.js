angular.module('starter.controllers', ['ngCookies'])

.controller('DashCtrl', function($scope, $sce, $http, Notes, Globals, Auth) {
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
        Auth.post(Globals.backendHostName() + 'notes/update_note/', $scope.userID, $scope.loginToken, {
	    'username': 'test_user', password: 'testpassword',
	    'is_new_note': true,
	    'title': $scope.query.text,
	    summary: $scope.newNote.summary,
	    data_points: data_pts
	}).success(function(data, status, headers, config) {
            console.log(config);
            console.log(data);
        }).error(function(data, status, headers, config) {
            console.log(config);
            console.log(data);
        });
    }

})

.controller('NotesCtrl', function($scope, Notes, $http, Globals, Auth) {
    Auth.post(Globals.backendHostName() + 'notes/', $scope.userID, $scope.loginToken, {
	'username': 'test_user',
	password: 'testpassword'
    }).success(function(data, status, headers, config) {
        Notes = data['notes'];
        $scope.notes = Notes;
    }).error(function(data, status, headers, config) {
        console.log(config);
        console.log(data);
    });

})

.controller('NoteDetailCtrl', function($scope, $stateParams, Notes, Globals, $sce, $http, Auth) {
    $scope.note = {};
    Auth.post(Globals.backendHostName() + 'notes/single/', $scope.userId, $scope.loginToken, {
	'username': 'test_user',
	password: 'testpassword',
	'note_id': $stateParams.noteId
    }).success(function(data, status, headers, config) {
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

.controller('AccountCtrl', function($scope, $cookies) {
    $scope.settings = {
        enableFriends: true
    };
})

.controller('LoginCtrl', function($scope, $ionicPopup, $state, $http, Globals, $cookies) {
    $scope.data = {};

    $scope.login = function() {
	//$http.post(Globals.backendHostName() + 'login/token/new.json', {'username': $scope.data.username, 'password': $scope.data.password}).
	$http({
	    url: Globals.backendHostName() + 'login/token/new.json',
	    method: 'POST',
	    data : [
		"username=" + $scope.data.username,
		"password=" + $scope.data.password
	    ].join('&'),
	    headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	    }
	}).
	    success(function(data, status, headers, config) {
		if (data['success']){
		    $scope.loginToken = data['token'];
		    $scope.userID     = data['user'];
		    $state.go('tab.dash');
		}
		else {
		    console.log(data + ", " + status);
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
