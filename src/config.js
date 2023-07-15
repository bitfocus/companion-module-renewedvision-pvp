const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module will control Renewed Vision PVP 3.1 or above.'
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'PVP Host',
				width: 4,
				required: true
			},
			{
				type: 'checkbox',
				id: 'https',
				label: 'Use HTTPS',
				width: 2,
				tooltip: 'Check if PVP requires an HTTPS connection.',
				default: false
			},
			{
				type: 'textinput',
				id: 'auth',
				label: 'Authentication Token',
				width: 4
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Port',
				width: 2,
				required: true,
				regex: this.REGEX_PORT
			},
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Backup Instance',
				value: "If you're running a backup instance of PVP, enter its connection details here. Leave empty to ignore."
			},
			{
				type: 'textinput',
				id: 'host_backup',
				label: 'PVP Host (Backup instance)',
				width: 4,
				required: false
			},
			{
				type: 'checkbox',
				id: 'https_backup',
				label: 'Use HTTPS',
				width: 2,
				tooltip: 'Check if PVP requires an HTTPS connection.',
				default: false
			},
			{
				type: 'textinput',
				id: 'auth_backup',
				label: 'Authentication Token',
				width: 4
			},
			{
				type: 'textinput',
				id: 'port_backup',
				label: 'Port',
				width: 2,
				required: false
			}
		];
	}
}