angular.module('starter.services', ['base64'])

.service('Globals', function(){
    return {
	backendHostName: function(){
	    return "https://togoogle-backend.herokuapp.com/";
	}
    }
})

// This handles passing lists of tags back to a main controller
.service('Tags', function(){
    var tagSets = {
	'noteTagSet': [],
	'dataPointSets': []
    };
    var set = [];
    return {
	setNoteTagSet: function(set) {
	    tagSets['noteTagSet'] = set;
	},
	setDataPointSets: function(sets) {
	    tagSets['dataPointSets'] = sets;
	},	
	getNoteTagSet: function() {
	    return tagSets['noteTagSet'];
	},
	getDataPointSets : function() {
	    return tagSets['dataPointSets'];
	},
	pushEmptyTag: function(set) {
	    set.push({'tagStr': ''});
	},
	tagsToJson: function(set) {
	    // This just takes the tagStr field for now. In the future
	    // this may hold more data
	    return set.map(function(tagEntity) {
		return { 'tag': tagEntity.tagStr };
	    });
	},
	jsonToTags: function(set) {
	    return set.map(function(postTag) {
		return { 'tagStr': postTag.tag };
	    });
	}
    }
})

.service('Auth', function($http, $cookies, $base64){
    return {
	post : function(path, userID, token, data) {
	    var authString = 'Basic ' + $base64.encode(userID + ':' + token);
	    console.log("authstring: " + authString);
	    return $http({
		url: path,
		method: 'POST',
		headers: {
		    'Authorization': authString
		},
		data: data
	    });
	},
	get  : function(path, userID, token) {
	    return $http({
		url: path,
		method: 'GET',
		headers: {
		    'Authorization': 'Basic ' + $base64.encode(userID + ':' + token)
		}
	    });
	},
	del  : function(path, userID, token, data) {
	    return $http({
		method: "DELETE",
		url: path,
		headers: {
		    'Authorization': 'Basic ' + $base64.encode(userID + ':' + token)
		},
		data : data		
	    })
	}
    }
})

.factory("user", function() {
    return {};
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
