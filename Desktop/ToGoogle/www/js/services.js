angular.module('starter.services', [])

.service('LoginService', function($q, $http) {
    return {
	loginUser: function(name, pw) {
	    var deferred = $q.defer();
	    var promise = deferred.promise;
	    
	    if (name == 'user' && pw == 'secret') {
		deferred.resolve('Welcome ' + name + '!');
	    } else {
		deferred.reject('Wrong credentials.');
	    }
	    promise.success = function(fn) {
		promise.then(fn);
		return promise;
	    }
	    promise.error = function(fn) {
		promise.then(null, fn);
		return promise;
	    }
	    return promise;
	}
    }
})

.service('Globals', function(){
    return {
	backendHostName: function(){
	    return "https://togoogle-backend.herokuapp.com/";
	}
    }
})


.factory('Notes', function($http) {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    // var Notes = [{
    //     id: 0,
    //     name: 'The 2014 Tsunami in Japan',
    //     fact1: 'It was really big.',
    //     fact2: 'People got hurt.',
    //     fact3: 'Did I mention it was huge?',
    //     summary: 'So in 2014, there was this really big hurricane that crashed super hard on a lot of people. It was pretty terrible, and pretty rough. Let`s just say it was no bueno.',
    //     reference: 'http://grantisom.com/'
    // },
    // {
    //     id: 1,
    //     name: 'McDonalds declining sales',
    //     fact2: '',
    //     fact3: '',
    //     reference: ''
    //
    // }];

    return {
        all: function() {
            $http.post('https://togoogle-backend.herokuapp.com/notes/', {'username': 'test_user', password: 'testpassword'}).success(function(data, status, headers, config) {
                Notes = data['notes'];
                console.log(config);
                console.log(data);
                console.log(Notes[0].title);
                return Notes;
            }).error(function(data, status, headers, config) {
                console.log(config);
                console.log(data);
            });
            // return Notes;
        },
        remove: function(note) {
            Notes.splice(Notes.indexOf(note), 1);
        },
        get: function(noteId) {
            for (var i = 0; i < Notes.length; i++) {
                if (Notes[i].id === parseInt(noteId)) {
                    return Notes[i];
                }
            }
            return null;
        },add: function(note) {
            Notes.push(note);
        },
    };
});
