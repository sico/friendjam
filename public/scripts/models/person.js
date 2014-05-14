define('models/person',
	['ko'],
function(ko) {
	function Person(person) {
		var self = this;
		self.model = person;
		self.key = person.get('key');
		self.trackName = ko.observable();
		self.album = ko.observable();
		self.artist = ko.observable();
		self.trackKey = ko.observable();

		self.isFollowed = ko.observable()

		person.on('change:lastSongPlayed', function(track) {
			updateTrack();
		});

		person.trackField('lastSongPlayed');
		updateTrack();

		function updateTrack() {
			var track = self.model.get('lastSongPlayed');
			if (track) {
				self.trackName(track.name);
				self.album(track.album);
				self.artist(track.artist);
				self.trackKey(track.key);
			}
		}

	}

	return Person;
});