var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	// Example: When this script was committed, a fix needed to be made
	// this will only be run if you had an instance of an older "version" before.
	// "version" is calculated out from how many upgradescripts your intance config has run.
	// So just add a addUpgradeScript when you commit a breaking change to the config, that fixes
	// the config.

	self.addUpgradeScript(function () {
		// just an example
		if (self.config.host !== undefined) {
			self.config.old_host = self.config.host;
		}
	});

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
};


instance.prototype.init = function() {
	var self = this;

	self.status(self.STATE_OK);

	debug = self.debug;
	log = self.log;
};


// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module will control Renewed Vision PVP ver 3.0'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			width: 4,
			regex: self.REGEX_PORT
		}
	]
};


// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;
	debug("destroy");
};


instance.prototype.actions = function(system) {
	var self = this;
	self.setActions({
		'clearLayer': {
			label: 'Clear Layer (id)',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			]
		},

		'muteLayer': {
			label: 'Mute Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			]
		},

		'unmuteLayer': {
			label: 'Unmute Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			]
		},

		'selectLayer': {
			label: 'Select Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			]
		},

		'hideLayer': {
			label: 'Hide Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			]
		},

		'unhideLayer': {
			label: 'Unhide Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			]
		},

		'selectPL': {
			label: 'Select Playlist',
			options: [
				{
					type: 'textinput',
					label: 'Playlist ID',
					id: 'pl',
					default: '1'
				}
			]
		},

		'triggerCue': {
			label: 'Trigger Cue',
			options: [
				{
					type: 'textinput',
					label: 'Cue ID',
					id: 'cue',
					default: '1'
				}
			]
		},

		'triggerPL': {
			label: 'Trigger Playlist',
			options: [
				{
					type: 'textinput',
					label: 'Playlist ID',
					id: 'pl',
					default: '1'
				}
			]
		},

		'triggerCuePL': {
			label: 'Trigger Cue in Playlist',
			options: [
				{
					type: 'textinput',
					label: 'Playlist ID',
					id: 'pl',
					default: '1'
				},
				{
					type: 'textinput',
					label: 'Cue ID',
					id: 'cue',
					default: '1'
				}
			]
		},

		'triggerCuePLLay': {
			label: 'Trigger Cue in Playlist on Layer',
			options: [
				{
					type: 'textinput',
					label: 'Playlist ID',
					id: 'pl',
					default: '1'
				},
				{
					type: 'textinput',
					label: 'Cue ID',
					id: 'cue',
					default: '1'
				},
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			]
		},

		'selectTargetSet': {
			label: 'Layer Target Set',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Target Set ID',
					id: 'ts',
					default: '1'
				},
			]
		},

		'layerPreset': {
			label: "Layer Preset",
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Layer Preset Name',
					id: 'lpn',
					default: 'Preset 1'
				}
			]
		},

		'opacity': {
			label: "Opacity",
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Opacity (%)',
					id: 'opacity',
					default: '100',
					regex: self.REGEX_NUMBER
				}
			]
		},

		'clearWs':    { label: 'Clear Workspace'},
		'muteWs':     { label: 'Mute Workspace'},
		'hideWs':     { label: 'Hide Workspace'},
		'unhideWs':   { label: 'Unhide Workspace'},
		'unmuteWs':   { label: 'Unmute Workspace'},

	});
}


instance.prototype.action = function(action) {
	var self = this;
	var cmd
	debug('action: ', action);
	var body = {};

	switch (action.action) {

		case 'clearLayer':
			cmd = '/clear/layer/' + action.options.idx;
			break;

		case 'hideLayer':
			cmd = '/hide/layer/' + action.options.idx;
			break;

		case 'muteLayer':
			cmd = '/mute/layer/' + action.options.idx;
			break;

		case 'unmuteLayer':
			cmd = '/unmute/layer/' + action.options.idx;
			break;

		case 'unhideLayer':
			cmd = '/unhide/layer/' + action.options.idx;
			break;

		case 'selectLayer':
			cmd = '/select/layer/' + action.options.idx;
			break;

		case 'selectPL':
			cmd = '/select/playlist/' + action.options.pl;
			break;

		case 'triggerCue':
			cmd = '/trigger/cue/' + action.options.cue;
			break;

		case 'triggerPL':
			cmd = '/trigger/playlist/' + action.options.pl;
			break;

		case 'triggerCuePL':
			cmd = '/trigger/playlist/' + action.options.pl + '/cue/' + action.options.cue;
			break;

		case 'triggerCuePLLay':
			cmd = '/trigger/layer/' + action.options.idx + '/playlist/' + action.options.pl + '/cue/' + action.options.cue;
			break;

		case 'clearWs':
			cmd= '/clear/workspace';
			break;

		case 'muteWs':
			cmd = '/mute/workspace';
			break;

		case 'unmuteWs':
			cmd = '/unmute/workspace';
			break;

		case 'hideWs':
			cmd = '/hide/workspace';
			break;

		case 'unhideWs':
			cmd = '/unhide/workspace';
			break;

		case 'selectTargetSet':
			cmd = '/targetSet/layer/' + action.options.idx;
			body = {
				value: action.options.ts
			};
			break;

		case 'layerPreset':
			cmd = '/layerPreset/layer/' + action.options.idx;
			body = {
				value: action.options.lpn
			};
			break;

		case 'opacity':
			// Opacity needs to be posted as a double.
			var opacity = Math.min(100, Math.max(0, parseInt(action.options.opacity)));
			opacity = Math.round(opacity) / 100.0;

			cmd = '/opacity/layer/' + action.options.idx;
			body = {
				value: opacity
			};
			break;

	}

	if (cmd !== undefined) {
		self.system.emit('rest', 'http://' + self.config.host +':'+ self.config.port +'/api/0'+ cmd, body, function (err, result) {
			if (err) {
				self.log('Error from PVP: ' + result);
				return;
				}
			console.log("Result from REST: ", result);
			});
	}

};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
