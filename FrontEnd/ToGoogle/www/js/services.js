angular.module('starter.services', [])

.factory('Notes', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var notes = [{
    id: 0,
    name: 'The 2014 Tsunami in Japan',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Good and bad rashes',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Why girls dont talk to you',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }];

  return {
    all: function() {
      return notes;
    },
    remove: function(note) {
      chats.splice(notes.indexOf(note), 1);
    },
    get: function(noteId) {
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === parseInt(noteId)) {
          return notes[i];
        }
      }
      return null;
    }
  };
});
