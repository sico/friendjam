define('main',
				['jquery',
	 			 'ko',
	 			 'models/player'],
function($, ko, Player) {

	var songs = ko.observableArray(),
			thePlayer = new Player();

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

	//setupSocket();

	ko.applyBindings({
		songs: songs,
		theTrack: thePlayer.theTrack,
		theQueue: thePlayer.theQueue,
		player: thePlayer
	});

});