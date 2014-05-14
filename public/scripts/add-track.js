define('add-track',
	['jquery','ko'],
function($, ko){

	var songs = ko.observableArray();
	var trackToAdd = ko.observable();
	var artistToAdd = ko.observable();

	function addSong() {
		$.ajax({
			url: '/api/v1/add_to_queue',
			data: {
				song: trackToAdd(),
				artist: artistToAdd()
			},
			success: function(data) {
				loadQueue();
			}
		});
	}

	return {
		trackToAdd: trackToAdd,
		artistToAdd: artistToAdd,
		addSong: addSong
	}
});