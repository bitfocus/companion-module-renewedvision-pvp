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
	self.system.emit('instance_actions', self.id, {
		'clearLayer': {
			label: 'Clear Layer (id)',
			options: [
				{
					 type: 'textinput',
					 label: 'layer id',
					 id: 'idx',
					 default: '1'
				}
			]
		},

		'muteLayer': {
			label: 'Mute Layer (id)',
			options: [
				{
					 type: 'textinput',
					 label: 'layer id',
					 id: 'idx',
					 default: '1'
				}
			]
		},
		'unmuteLayer': {
			label: 'Unmute Layer (id)',
			options: [
				{
					 type: 'textinput',
					 label: 'layer id',
					 id: 'idx',
					 default: '1'
				}
			]
		},

		'selectLayer': {
			label: 'Select Layer (id)',
			options: [
				{
					 type: 'textinput',
					 label: 'layer id',
					 id: 'idx',
					 default: '1'
				}
			]
		},

		'hideLayer': {
			label: 'Hide Layer (id)',
			options: [
				{
					 type: 'textinput',
					 label: 'layer id',
					 id: 'idx',
					 default: '1'
				}
			]
		},

		'unhideLayer': {
			label: 'Unhide Layer (id)',
			options: [
				{
					 type: 'textinput',
					 label: 'layer id',
					 id: 'idx',
					 default: '1'
				}
			]
		},

		'selectPL': {
			label: 'Select Playlist (id)',
			options: [
				{
					 type: 'textinput',
					 label: 'Playlist id',
					 id: 'pl',
					 default: '1'
				}
			]
		},

		'triggerCue': {
			label: 'Trigger Cue (id)',
			options: [
				{
					 type: 'textinput',
					 label: 'Cue id',
					 id: 'cue',
					 default: '1'
				}
			]
		},

		'triggerPL': {
			label: 'Trigger Playlist (id)',
			options: [
				{
					 type: 'textinput',
					 label: 'Playlist Id',
					 id: 'pl',
					 default: '1'
				}
			]
		},

		'triggerCuePL': {
			label: 'Trigger Cue in Playlist (Playlist ID) (Cue ID)',
			options: [
				{
					 type: 'textinput',
					 label: 'Playlist id',
					 id: 'pl',
					 default: '1'
				},
				{
					 type: 'textinput',
					 label: 'Cue Id',
					 id: 'cue',
					 default: '1'
				}
			]
		},

		'triggerCuePLLay': {
			label: 'Trigger Cue in Playlist on Layer (Layer ID) (Playlist ID) (Cue ID)',
			options: [
				{
					 type: 'textinput',
					 label: 'Playlist id',
					 id: 'pl',
					 default: '1'
				},
				{
					 type: 'textinput',
					 label: 'Cue Id',
					 id: 'cue',
					 default: '1'
				},
				{
					 type: 'textinput',
					 label: 'Layer Id',
					 id: 'idx',
					 default: '1'
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

	}

	if (cmd !== undefined) {
		self.system.emit('rest', 'http://' + self.config.host +':'+ self.config.port +'/api/0'+ cmd, {},function (err, result) {
			if (err) {
				self.log('Error from PVP: ' + result);
				return;
				}
			console.log("Result from REST: ", result);
			});
	}

};







instance.module_info = {
	label: 'PVP',
	id: 'pvp',
	version: '0.0.1'
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
