angular.module('starter.controllers', ['ngCookies'])

.controller('DashCtrl', function($scope, $sce, $http, Notes, Globals, Auth, $cookies, $ionicPopup) {
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
	console.log('userID:' +  $cookies['userID']);
	console.log('logintoken: ' + $cookies['loginToken']);
        Auth.post(Globals.backendHostName() + 'notes/update_note/', $cookies['userID'], $cookies['loginToken'], {
	    //'username': 'test_user', password: 'testpassword',
	    'is_new_note': true,
	    'title': $scope.query.text,
	    summary: $scope.newNote.summary,
	    data_points: data_pts
	}).success(function(data, status, headers, config) {	    
            console.log(config);
            console.log(data);

	    if (data['success']) {
		$cookies['numInvitations'] = data['num_invitations'];
		var alertPopup = $ionicPopup.alert({
		    title: 'Note saved!',
		    template: ''
		}) ;
	    }
	    else {
		var alertPopup = $ionicPopup.alert({
		    title: 'Unable to save!',
		    template: 'Error: ' + data['error']
		}) ;
	    }
        }).error(function(data, status, headers, config) {
            console.log(config);
            console.log(data);
        });
    }

})

.controller('NotesCtrl', function($scope, Notes, $http, Globals, Auth, $cookies, $ionicPopup) {
    console.log('in NotesCtrl!');
    console.log('UserID: ' + $cookies['userID'] + ' loginToken: ' + $cookies['loginToken']);

    Auth.get(Globals.backendHostName() + 'notes/', $cookies['userID'], $cookies['loginToken']).
      success(function(data, status, headers, config) {
          Notes = data['notes'];
	  $cookies['numInvitations'] = data['num_invitations'];
          $scope.notes = Notes;
      }).error(function(data, status, headers, config) {
          console.log(config);
          console.log(data);
      });

$scope.remove = function(noteToDelete, index) {
	console.log(noteToDelete);
	Auth.del(Globals.backendHostName() + 'notes/update_note/', $cookies['userID'], $cookies['loginToken'], { 'note_id' : noteToDelete.note_id }).
	    success(function(data, status, headers, config) {
		if (data['success']) {
		    console.log($scope.notes);
		    
		    $scope.notes.splice(index, 1);
		    $cookies['numInvitations'] = data['num_invitations'];
		    
		    var alertPopup = $ionicPopup.alert({
			title: 'Note Deleted',
			template: ''
		    }) ;
		}
		else{
		    var alertPopup = $ionicPopup.alert({
			title: 'Unable to Delete Note',
			template: 'Error: ' + data['error']
		    }) ;
		}
	    }).error(function(data, status, headers, config) {
		var alertPopup = $ionicPopup.alert({
		    title: 'Unable to access database.',
		    template: 'Please try to delete again later.'
		}) ;
	    });
    };

})

.controller('NoteDetailCtrl', function($scope, $stateParams, Notes, Globals, $sce, $http, Auth, $cookies) {
    $scope.note = {};
     Auth.post(Globals.backendHostName() + 'notes/single/', $cookies['userID'], $cookies['loginToken'], {
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
	$cookies['numInvitations'] = data['num_invitations'];
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
        Auth.post(Globals.backendHostName() + 'notes/update_note/', $cookies['userID'], $cookies['loginToken'], {
	    'note_id': $stateParams.noteId,
	    'is_new_note': false,
	    'title': '$scope.notey.title',
	    summary: $scope.notey.summary,
	    data_points: new_data_points
	}).success(function(data, status, headers, config) {
	    if (data['success']) {
		$cookies['numInvitations'] = data['num_invitations'];
		var alertPopup = $ionicPopup.alert({
		    title: 'Note Saved!',
		    template: ''
		}) ;
	    }
	    else {
		var alertPopup = $ionicPopup.alert({
		    title: 'Unable to save!',
		    template: 'Error: ' + data['error']
		}) ;
	    }
        }).error(function(data, status, headers, config) {
            console.log(config);
            console.log(data);
        });
    }

})

.controller('CreateUserCtrl', function($scope, Globals, $stateParams, $ionicPopup, $http, $state) {
    $scope.data = {};
    console.log("in createuser");
    $scope.createAccount = function() {
	if ($scope.data.password == $scope.data.password_verify){
	    $http.post(Globals.backendHostName() + 'account/new_user/', {
		"user_id"    : $stateParams.inviterID,
		"invite_hash": $stateParams.hash,
		"username"   : $scope.data.username,
		"password"   : $scope.data.password,
		"first_name" : $scope.data.firstName,
		"last_name"  : $scope.data.lastName,
		"email"      : $scope.data.email
	    }).success(function(data, status, headers, config) {
		if (data['success']){
		    $scope.data.username = '';
		    $scope.data.password = '';
		    $scope.data.firstName = '';
		    $scope.data.lastName = '';
		    $scope.data.email = '';
		    $state.go('login');
		}
		else if (data['username_taken']){
		    var alertPopup = $ionicPopup.alert({
			title: 'Username is taken.',
			template: 'Please try a different username.'
		    }) ;
		}
		else{
		    var alertPopup = $ionicPopup.alert({
			title: 'Unable to make account!',
			template: 'Please try to create your account again later. Sorry for the inconvenience.'
		    }) ;
		}
	    }).error(function(data, status, headers, config) {
		var alertPopup = $ionicPopup.alert({
		    title: 'Unable to make account!',
		    template: 'Please try to create your account again later. Sorry for the inconvenience.'
		}) 
	    });
	}
	else {
	    var alertPopup = $ionicPopup.alert({
		title: 'Passwords do not match',
		template: 'Please retype your password'
	    }) 
	}
    };
})

.controller('AccountCtrl', function($scope, $cookies, Auth, Globals, $ionicPopup) {
    $scope.data = {};
    $scope.numInvitations = $cookies['numInvitations'];
    console.log($scope.numInvitations);
    $scope.settings = {
        enableFriends: true
    };

    $scope.invite = function(){
	Auth.post(Globals.backendHostName() + 'account/invite/', $cookies['userID'], $cookies['loginToken'], {
	    "invitee": $scope.data.inviteEmail,
	    "front_end_url": "http://www.ripplenote.com/#/new" //"http://www.ripplenote.com/account/new"
	}).success(function(data, status, headers, config){
	    $cookies['numInvitations'] = data['num_invitations'];
	    if (data['success']) {
		var alertPopup = $ionicPopup.alert({
		    title: 'Invitation sent!',
		    template: 'Your friend should receive an email shortly! You have ' + $cookies['numInvitations'] + ' invitations left.'
		}) 
            }
	    else {
		var alertPopup = $ionicPopup.alert({
		    title: 'Unable to send email!',
		    template: 'Error: ' + data['error'] // remove this when more public
		}) 
	    }

	}).error(function(data, status, headers, config){
	    console.log(data);
	    console.log(status);
	    console.log(headers);
	    console.log(config);
	    var alertPopup = $ionicPopup.alert({
		title: 'Unable to send invitation!',
		template: 'Please try inviting again later.'
	    })
	});
    };
})

.controller('LoginCtrl', function($scope, $ionicPopup, $state, $http, Globals, $cookies) {
    $scope.data = {};

    $scope.logout = function() {
	delete $cookies['userID'];
	delete $cookies['loginToken'];
    };
    
    $scope.login = function() {
	console.log($scope.data.username);
	console.log($scope.data.password);
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
		$cookies['loginToken'] = data['token'];
		$cookies['userID']     = data['user'];
		$scope.data.username = '';
		$scope.data.password = '';
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
