const { combineRgb } = require('@companion-module/base');

module.exports = {
	initPresets: function () {
		let self = this;

		const foregroundColor = combineRgb(255, 255, 255) // White
		const foregroundColorBlack = combineRgb(0, 0, 0) // Black
		const backgroundColorRed = combineRgb(255, 0, 0) // Red
		const backgroundColorGreen = combineRgb(0, 255, 0) // Red

		let presets = [
			{
				type: 'button',
				category: 'Layers',
				name: 'This button will clear the selected Layer.',
				style: {
					text: 'Clear\\nLayer #',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
					latch: false
				},
				steps: [
					{
						down: [
							{
								actionId: 'clearLayer',
								options: {
									idx: 0,
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			},
			{
				type: 'button',
				category: 'Layers',
				name: 'This button will mute the selected Layer.',
				style: {
					text: 'Mute\\nLayer #',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 153, 204),
					latch: false
				},
				steps: [
					{
						down: [
							{
								actionId: 'muteLayer',
								options: {
									idx: 0,
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			},
			{
				type: 'button',
				category: 'Layers',
				name: 'This button will unmute the selected Layer.',
				style: {
					text: 'Unmute\\nLayer #',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 204, 0),
					latch: false
				},
				steps: [
					{
						down: [
							{
								actionId: 'unmuteLayer',
								options: {
									idx: 0
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			},
			{
				type: 'button',
				category: 'Layers',
				name: 'This button will mute and unmute the selected Layer.',
				style: {
					text: 'Mute/\\nUnmute\\nLayer #',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(204, 0, 204),
					latch: true
				},
				steps: [
					{
						down: [
							{
								actionId: 'muteLayer',
								options: {
									idx: 0
								}
							}
						],
						up: [
							{
								actionId: 'unmuteLayer',
								options: {
									idx: 0,
								}
							}
						]
					}
				],
				feedbacks: []
			},
			{
				type: 'button',
				category: 'Layers',
				name: 'This button will select and target a layer.',
				style: {
					text: 'Select \\nLayer #',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
					latch: false
				},
				steps: [
					{
						down: [
							{
								actionId: 'selectLayer',
								options: {
									idx: 0,
									target: 'true',
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			},
			{
				type: 'button',
				category: 'Layers',
				name: 'This button will hide and unhide the selected Layer.',
				style: {
					text: 'Hide/Show\\nLayer #',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
					latch: true
				},
				steps: [
					{
						down: [
							{
								actionId: 'hideLayer',
								options: {
									idx: 0
								}
							}
						],
						up: [
							{
								actionId: 'unhideLayer',
								options: {
									idx: 0,
								}
							}
						]
					}
				],
				feedbacks: []
			},
			{
				type: 'button',
				category: 'Layers',
				name: 'This button will select a Playlist.',
				style: {
					text: 'Select\\nPlaylist',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
					latch: false
				},
				steps: [
					{
						down: [
							{
								actionId: 'selectPL',
								options: {
									pl: 0,
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			},
			{
				type: 'button',
				category: 'Layers',
				name: 'This button will trigger a Cue.',
				style: {
					text: 'Trigger\\nCue',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
					latch: false
				},
				steps: [
					{
						down: [
							{
								actionId: 'triggerCue',
								options: {
									cue: 0,
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			},
			{
				type: 'button',
				category: 'Layers',
				name: 'This button will pause media playing on the selected Layer.',
				style: {
					text: 'Pause\\nLayer #',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
					latch: false
				},
				steps: [
					{
						down: [
							{
								actionId: 'pauseLayer',
								options: {
									idx: 0
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			},
			{
				type: 'button',
				category: 'Layers',
				name: 'This button will play/resume media playing on the selected Layer.',
				style: {
					text: 'Play\\nLayer #',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
					latch: false
				},
				steps: [
					{
						down: [
							{
								actionId: 'playLayer',
								options: {
									idx: 0
								}
							}
						],
						up: []
					}
				],
				feedbacks: []
			},
	
	
			/**
			* Presets for Workspace
			*/
	
			{
				type: 'button',
				category: 'Workspace',
				name: 'This button will clear the Workspace.',
				style: {
					text: 'Clear\\nWork\\nspace',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(228, 0, 255),
					latch: false
				},
				steps: [
					{
						down: [
							{
								actionId: 'clearWs'
							}
						],
						up: []
					}
				],
				feedbacks: []
			},
			{
				type: 'button',
				category: 'Workspace',
				name: 'This button will mute the Workspace.',
				style: {
					text: 'Mute\\nWork\\nspace',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 102, 255),
					latch: false
				},
				steps: [
					{
						down: [
							{
								actionId: 'muteWs'
							}
						],
						up: []
					}
				],
				feedbacks: []
			},
			{
				type: 'button',
				category: 'Workspace',
				name: 'This button will unmute the Workspace.',
				style: {
					text: 'Unmute\\nWork\\nspace',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 153, 51),
					latch: false
				},
				steps: [
					{
						down: [
							{
								actionId: 'unmuteWs'
							}
						],
						up: []
					}
				],
				feedbacks: []
			},
			{
				type: 'button',
				category: 'Workspace',
				name: 'This button will mute and unmute the Workspace.',
				style: {
					text: 'Mute\\nUnmute\\nWorknspace',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(102, 0, 102),
					latch: true
				},
				steps: [
					{
						down: [
							{
								actionId: 'muteWs'
							}
						],
						up: [
							{
								actionId: 'unmuteWs',
							}
						]
					}
				],
				feedbacks: []
			}
		];
		
		self.setPresetDefinitions(presets);
	}
}