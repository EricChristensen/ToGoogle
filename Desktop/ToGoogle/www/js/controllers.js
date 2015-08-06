angular.module('starter.controllers', ['ngCookies'])

.controller('NotesCtrl', function($scope, Notes, $http, Globals, Auth, $cookies, $ionicPopup) {
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
	Auth.del(Globals.backendHostName() + 'notes/update_note/', $cookies['userID'], $cookies['loginToken'], { 'note_id' : noteToDelete.note_id }).
	    success(function(data, status, headers, config) {
		if (data['success']) {
		    
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

.controller('NoteDetailCtrl', function($scope, $stateParams, Notes, Globals, $sce, $http, Auth, $cookies, $ionicPopup, Tags) {
    var mkEmptyDatapoint = function(){ return {
	'datum': '',
	'creation_date_time': '',
	'tagSet': []
    }; }
    var allQueries = [];
    $scope.note = {};
    $scope.query = {};    
    $scope.note.summary = '';
    $scope.datapoints = [];
    $scope.note.title = '';
    $scope.note.tagSet = [];
    var postComplete = false;

    var retrieveNote = $stateParams.noteId;
    
    $scope.search = function() {
	$scope.query.currentURL = $sce.trustAsResourceUrl('https://duckduckgo.com/?q='+ $scope.query.text +'&kp=-1&kl=us-en');
	allQueries.push({'query': $scope.query.text});
    };

    $scope.pushEmptyDatapoint = function(){
	//var emptyDataPoint = { 'datum': '', 'creation_date_time': '' };
	$scope.datapoints.push(mkEmptyDatapoint());
    };
    
    if (retrieveNote) {
	Auth.post(Globals.backendHostName() + 'notes/single/', $cookies['userID'], $cookies['loginToken'], {
	    'note_id': $stateParams.noteId
	}).success(function(data, status, headers, config) {
	    $scope.note.title = data['title'];
	    if (data['queries'] !== [] ) {
		$scope.query.text = data['queries'][data['queries'].length - 1];		
	    } else {	    
		$scope.query.text = data['title'];
	    }
	    $scope.note.summary = data['summary'];
	    $scope.note.tagSet  = data['tags'];
	    
	    $scope.datapoints = data['data_points'].map(function(pt) {
		pt.tagSet = pt.tags;
		return pt;
	    });
	    
	    $scope.datapoints.push(mkEmptyDatapoint());
	    
	    $cookies['numInvitations'] = data['num_invitations'];
	    $scope.search();

            // REMOVE THIS WHOLE SECTION ONCE BACKEND HANDLES TAGGING
	    if ($scope.note.tagSet === undefined) {
		$scope.note.tagSet = [];
		for (pt in $scope.datapoints) {
		    pt['tagSet'] = [];
		}
	    }
	    // END REMOVAL BLOCK
	    
	    postComplete = true;
	}).error(function(data, status, headers, config) {
            console.log(config);
            console.log(data);
	});
	
	// Adds empty datapoints dynamically    	
    } else {
	$scope.pushEmptyDatapoint();
	postComplete = true;
    }


    $scope.save = function(note) {
	var dataPointsToSave = $scope.datapoints.filter(function(pt) { return pt.datum }).
	    map(function(pt){		
		if (pt.data_point_id){
		    return {
			'datum': pt.datum,
			'data_point_id': pt.data_point_id,
			'tags' : Tags.tagsToJson(pt.tagSet)			
		    } ;
	       } else {
		   return {
		       'datum': pt.datum,
		       'tags' : Tags.tagsToJson(pt.tagSet)
		   };
	       }
	    });

	var postJSON = {};

	console.log("Note Tags in save!");
	
	if ($stateParams.noteId) {
	    postJSON['note_id'] = $stateParams.noteId;
	    postJSON['is_new_note'] = false	    
	} else {
	    postJSON['is_new_note'] = true;
	}
	postJSON['title'] = $scope.note.title;
	postJSON['summary'] = $scope.note.summary;
	postJSON['data_points'] = dataPointsToSave;
	postJSON['queries'] = allQueries;
	postJSON['tags']    = Tags.tagsToJson($scope.note.tagSet);

	console.log(postJSON);
        Auth.post(
	    Globals.backendHostName() + 'notes/update_note/',
	    $cookies['userID'], $cookies['loginToken'],
	    postJSON
	).success(function(data, status, headers, config) {
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

    // Pushes new empty notes dynamically 
    $scope.$watch(
	function() {
	    if (postComplete){
		return $scope.datapoints[$scope.datapoints.length - 1].datum;
	    }
	    return '';
	},
	function(newDatum, oldDatum) {
	    if ( newDatum !== oldDatum && oldDatum === '') {
		$scope.datapoints.push(mkEmptyDatapoint());
	    }
	}
    );

})

.controller('CreateUserCtrl', function($scope, Globals, $stateParams, $ionicPopup, $http, $state) {
    $scope.data = {};
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

.controller('TagCtrl', function($scope, Tags) {
    $scope.newTagStr = '';
    //$scope.tagSet = Tags.getNewTagSet(); // This should probably be done by the parent controller

    $scope.addTag = function(event) {
	if (event.keyCode == 13){
	    Tags.pushEmptyTag($scope.tagSet);
	    $scope.tagSet[$scope.tagSet.length - 1].tagStr = $scope.newTagStr;
	    $scope.newTagStr = '';
	}
    };
})
