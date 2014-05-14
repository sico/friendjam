define('main',
				['jquery',
	 			 'ko',
	 			 'models/player',
	 			 'models/person'],
function($, ko, Player, Person) {

	var songs = ko.observableArray(),
			thePlayer = new Player(),
			isAuthenticated = ko.observable(),
			followingList = ko.observableArray(),
			isLoading = ko.observable(true),
			followedUser = ko.observable();

	function setupSocket() {
		var scheme = 'ws://';
		var uri = scheme + window.document.location.host + '/';
		var ws = new WebSocket(uri);

		ws.onmessage = function(msg) {
		  var data = JSON.parse(msg.data);
		  console.log(data);
		  if ( data.message && data.message === "list updated" ) {
		  	// check if song is already in list
		  	if ( keyList().indexOf(data.song['rdio_key']) === -1 ) {
		  		loadQueue();
		  	}
		  }
		};

	}

	function authenticate() {
		R.authenticate(function(authenticated) {
			if (authenticated) {
				isAuthenticated(true);
			}
		});
	}

	R.ready(function() {
		isLoading(false);
		if ( R.authenticated() ) {
			isAuthenticated(true);
			getFollowing();
		} else {
			isAuthenticated(false);
		}
	});

	function getFollowing() {
		R.ready(function() {
      R.currentUser.trackFollowing(function() {

        var following = R.currentUser.get('following');

        following.on('change:online', function(person, online) {
          if (online) {
            followingList.push(new Person(person));
          } else {
            followingList.remove(function(item) {
            	return item.key === person.get('key');
            })
          }
        });

        following.on('add', function(person) {
          person.trackPresence();
        });

        var person;
        for (var a = 0; a < following.length; a++) {
          person = following.at(a);
          person.trackPresence();
          if (person.get('online')) {
            followingList.push(new Person(person));
          }
        }

      });
    });
	}

	function doPlay(track) {
		R.player.play({source: track.key});
	}

	function chooseFollowing(data, event) {
		if (followedUser()) {
			followedUser().model.off('change:lastSongPlayed', doPlay);
		}

		followedUser(data);
		R.player.play({source: data.trackKey()});
		data.model.on('change:lastSongPlayed', doPlay);
	}

	ko.applyBindings({
		songs: songs,
		theTrack: thePlayer.theTrack,
		theQueue: thePlayer.theQueue,
		player: thePlayer,
		authenticate: authenticate,
		isAuthenticated: isAuthenticated,
		followingList: followingList,
		isLoading: isLoading,
		chooseFollowing: chooseFollowing,
		followedUser: followedUser
	});

});