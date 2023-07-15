const { InstanceStatus } = require('@companion-module/base');

const Client = require('node-rest-client').Client;

module.exports = {
	setPvpIps: function() {
		let self = this;
	
		self.arrTargets = [];
	
		let isPortValid = function(port) {
			port = parseInt(port);
			return !isNaN(port) && port > 1024 && port <= 65535;
		}
	
		if (self.config.host && isPortValid(self.config.port)) {
			// Add the primary IP/port of PVP
			self.arrTargets.push({
				host  : self.config.host,
				https : self.config.https || false,
				port  : self.config.port,
				auth  : self.config.auth || ''
			});
		}
	
		// If a backup instance was defined, add it too.
		if (self.config.host_backup && isPortValid(self.config.port_backup)) {
			self.arrTargets.push({
				host  : self.config.host_backup,
				https : self.config.https_backup || false,
				port  : self.config.port_backup,
				auth  : self.config.auth_backup || ''
			});
		}
	
		if (self.arrTargets.length === 0) {
			self.log('error', 'No valid PVP instances defined. Check host/port.');
		}
		else {
			self.updateStatus(InstanceStatus.Ok);
		}
	},

	/**
	 * Runs the [POST] command against PVP.
	 *
	 * @param cmd           The command the run. Must start with '/'
	 * @param body          The body of the POST content
	 */
	doCommand: function(cmd, body) {
		let self = this;
		body = body || {};

		// Do this command against the primary PVP and the backup PVP (if configured).
		for (let i = 0; i < self.arrTargets.length; i++) {
			let target = self.arrTargets[i];

			let args = {
				headers: {
					'Authorization': 'Bearer ' + target.auth
				},
				connection : { rejectUnauthorized : false },
				data: body
			};
			
			let client = new Client();

			let url = self.makeUrl(cmd, target);
		
			client.post(url, args, function (data, response) {
				//do something with response
				self.checkFeedbacks();
				self.checkVariables();
			})
			.on('error', function(error) {
				self.log('error', 'Error Sending Command ' + error.toString());
			});
		}
	},

	/**
	 * Makes the complete URL.
	 *
	 * @param cmd           Must start with a /
	 * @param target        The target PVP instance
	 */
	makeUrl: function(cmd, target) {
		var self = this;

		if (cmd[0] !== '/') {
			throw new Error('cmd must start with a /');
		}

		return (target.https ? 'https://' : 'http://') + target.host + ':' + target.port + '/api/0' + cmd;
	},

	/**
	 * Checks if the ID is a number [interpreted as an index in PVP] and, if so, ensures it's not
	 *   lower than is allowed. PVP will crash if the ID is a negative index (or <= -2 for playlists,
	 *   since -1 means "Video Input").
	 *
	 * Crashes confirmed in PVP 3.3.2 (50528776)
	 *
	 * @param id             The ID to check. May be a a string [name], a UUID, or an integer
	 * @param min            The minimum integer to allow
	 * @param errorMessage   The error message to throw if the ID is an out of bounds index
	 */
	checkId: function(id, min, errorMessage) {

		// Parse id to an integer. If it (as a string) matches id, then the value is a numeric index.
		let parsed = parseInt(id, 10);
		if (parsed.toString() !== id) {
			// Not a numeric index. Use as-is.
			return id;
		}

		if (parsed < min) {
			throw new Error(errorMessage);
		}

		return id;

	},

	/**
	 * Checks if the Layer ID is valid.
	 *
	 * @param                The ID to check
	 */
	checkLayerId: function(id) {
		return this.checkId(id, 0, "Layer ID can't be lower than 0.");
	},

	/**
	 * Checks if the Playlist ID is valid.
	 *
	 * @param                The ID to check
	 */
	checkPlaylistId: function(id) {
		return this.checkId(id, -1, "Playlist ID can't be lower than -1.");
	},

	/**
	 * Checks if the Cue ID is valid.
	 *
	 * @param                The ID to check
	 */
	checkCueId: function(id) {
		return this.checkId(id, 0, "Cue ID can't be lower than 0.");
	},

	/**
	 * Changes the opacity from a whole number (0 to 100) to a double (0.0 to 1.0).
	 *
	 * @param opacity       A whole number percentage from 0 to 100
	 * @return              The opacity as a double
	 */
	formatOpacity: function(opacity) {
		// Force the percentage bounds and convert to a double.
		opacity = Math.min(100, Math.max(0, parseInt(opacity)));
		return Math.round(opacity) / 100.0;
	}
}