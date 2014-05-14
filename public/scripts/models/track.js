define('models/track',
	[],
function() {
	function Track(options) {
		for (var k in options) {
			this[k] = options[k];
    }
	}

	return Track;
});