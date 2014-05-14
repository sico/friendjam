define('models/player',
	['ko','models/track'],
function(ko, Track) {
	var theTrack = ko.observable(new Track({}));
	var theQueue = ko.observableArray();
	var playstate = ko.observable();

	// add initial event listeners to stuff
	R.ready(
		function() {
			R.player.on("change:playingTrack", function(track) {
				theTrack(new Track({
					icon: track.get('icon'),
					title: track.get('name'),
					album: track.get('album'),
					artist: track.get('artist')
				}));
			});

			R.player.on("change:playState", function(state) {
          if (state === R.player.PLAYSTATE_PLAYING || state === R.player.PLAYSTATE_BUFFERING) {
            playstate('playing');
          } else {
            playstate('paused');
          }
        });

			// queue change events
			R.player.queue.on('add', function(model, collection, info) {
			  console.log("source " + model.get("key") + " added to queue at " + info.index);
			  theQueue(R.player.queue.toJSON());
			});

			R.player.queue.on("remove", function(model, collection, info) {
			  console.log("source " + model.get("key") + " removed from queue at " + info.index);
			  theQueue(R.player.queue.toJSON());
			});

			R.player.queue.on("reset", function(collection) {
			  console.log("queue contents reset");
			  theQueue(R.player.queue.toJSON());
			});
		}
	);

	// wrapper object for the player. holds reference to track playing.
	function Player(options) {
		this.playState = playstate;
		this.theTrack = theTrack;
		this.theQueue = theQueue;
	}

	Player.prototype.addToQueue = function addToQueue(sourceKey) {
		R.ready( // make sure player is ready
			function() {
				R.player.queue.add(sourceKey);
			}
		);
	}

	Player.prototype.resetQueue = function resetQueue() {
		R.ready(
			function(){
				R.player.queue.clear();
			}
		);
	}

	Player.prototype.back = function back() {
		R.ready(function(){
			R.player.previous();
		});
	}

	Player.prototype.next = function next() {
		R.ready(function(){
			R.player.next();
		});
	}

	Player.prototype.togglePause = function togglePause() {
		R.ready(function() {
			R.player.togglePause();
		});
	}

	return Player;
});