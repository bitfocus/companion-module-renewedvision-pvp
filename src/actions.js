module.exports = {
	initActions: function () {
		let self = this;
		let actions = {};

		actions.clearLayer = {
			name: 'Clear Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				self.doCommand('/clear/layer/' + self.checkLayerId(idx));
			}
		};
		
		actions.muteLayer = {
			name: 'Mute Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				self.doCommand('/mute/layer/' + self.checkLayerId(idx));
			}
		};
		
		actions.unmuteLayer = {
			name: 'Unmute Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				self.doCommand('/unmute/layer/' + self.checkLayerId(idx));
			}
		};
		
		actions.selectLayer = {
			name: 'Select Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				},
				{
					type: 'dropdown',
					label: 'Target Layer?',
					id: 'target',
					default: 'true',
					choices: [ { id:'true', label:'Yes' }, { id:'false', label:'No' } ]
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				let target = action.options.target;
				self.doCommand('/select/layer/' + self.checkLayerId(idx) + '?target=' + target);
			}
		};
		
		actions.hideLayer = {
			name: 'Hide Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				self.doCommand('/hide/layer/' + self.checkLayerId(idx));
			}
		};
		
		actions.unhideLayer = {
			name: 'Unhide Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				self.doCommand('/unhide/layer/' + self.checkLayerId(idx));
			}
		};
		
		actions.selectPL = {
			name: 'Select Playlist',
			options: [
				{
					type: 'textinput',
					label: 'Playlist ID',
					id: 'pl',
					default: '0'
				}
			],
			callback: async function (action) {
				let pl = await self.parseVariablesInString(action.options.pl);
				self.doCommand('/select/playlist/' + self.checkPlaylistId(pl));
			}
		};
		
		actions.triggerCue = {
			name: 'Trigger Cue',
			options: [
				{
					type: 'textinput',
					label: 'Cue ID',
					id: 'cue',
					default: '0'
				}
			],
			callback: async function (action) {
				let cue = await self.parseVariablesInString(action.options.cue);
				self.doCommand('/trigger/cue/' + self.checkCueId(cue));
			}
		};
		
		actions.triggerPL = {
			name: 'Trigger Playlist',
			options: [
				{
					type: 'textinput',
					label: 'Playlist ID',
					id: 'pl',
					default: '0'
				}
			],
			callback: async function (action) {
				let pl = await self.parseVariablesInString(action.options.pl);
				self.doCommand('/trigger/playlist/' + self.checkPlaylistId(pl));
			}
		};
		
		actions.triggerCuePL = {
			name: 'Trigger Cue in Playlist',
			options: [
				{
					type: 'textinput',
					label: 'Playlist ID',
					id: 'pl',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Cue ID',
					id: 'cue',
					default: '0'
				}
			],
			callback: async function (action) {
				let pl = await self.parseVariablesInString(action.options.pl);
				let cue = await self.parseVariablesInString(action.options.cue);
				self.doCommand('/trigger/playlist/' + self.checkPlaylistId(pl) + '/cue/' + self.checkCueId(cue));
			}
		};
		
		actions.triggerCuePLLay = {
			name: 'Trigger Cue in Playlist on Layer',
			options: [
				{
					type: 'textinput',
					label: 'Playlist ID',
					id: 'pl',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Cue ID',
					id: 'cue',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			],
			callback: async function (action) {
				let pl = await self.parseVariablesInString(action.options.pl);
				let cue = await self.parseVariablesInString(action.options.cue);
				let idx = await self.parseVariablesInString(action.options.idx);
				self.doCommand('/trigger/layer/' + self.checkLayerId(idx) + '/playlist/' + self.checkPlaylistId(pl) + '/cue/' + self.checkCueId(cue));
			}
		};
		
		actions.selectTargetSet = {
			name: 'Layer Target Set',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Target Set',
					id: 'ts',
					default: ''
				},
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				let ts = await self.parseVariablesInString(action.options.ts);
				self.doCommand('/targetSet/layer/' + self.checkLayerId(idx), { value: ts });
			}
		};
		
		actions.layerPreset = {
			name: 'Layer Preset',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Preset Name',
					id: 'lpn',
					default: 'Preset 1'
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				let lpn = await self.parseVariablesInString(action.options.lpn);
				self.doCommand('/layerPreset/layer/' + self.checkLayerId(idx), { value: lpn });
			}
		};
		
		actions.layerEffectPreset = {
			name: 'Layer Effect Preset',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Effect Preset Name',
					id: 'epn',
					default: ''
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				let epn = await self.parseVariablesInString(action.options.epn);
				self.doCommand('/effectsPreset/layer/' + self.checkLayerId(idx), { value: epn });
				if (epn === '') {
					// This will clear all the effects from the layer
					self.doCommand('/effects/layer/' + self.checkLayerId(pt.idx), { });
				}
			}
		};
		
		actions.opacity = {
			name: 'Layer Opacity',
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
					regex: self.REGEX_SIGNED_NUMBER
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				let opacity = await self.parseVariablesInString(action.options.opacity);
				// Opacity needs to be posted as a double.
				if (opacity[0] === '+' || opacity[0] === '-') {
					// Relative opacity. First retrieve the layer's current opacity.
		
					// Do this command against the primary PVP and the backup PVP (if configured).
					for (var i=0; i<self.arrTargets.length; i++) {
						var target = self.arrTargets[i];
		
						self.getRest('/opacity/layer/' + self.checkLayerId(idx), target).then(function(arrResult) {
							var target = arrResult[0];
		
							// Convert the current opacity from a float to a percent, and add on the
							//  relative opacity.
							var opacity = parseFloat(arrResult[1].opacity.value) * 100;
							self.postRest('/opacity/layer/' + self.checkLayerId(opt.idx), target,
								{ value: self.formatOpacity(opacity + parseInt(opt.opacity)) }
							).catch(function(arrResult) {
								self.log('error', arrResult[0].host + ':' + arrResult[0].port + ' - ' + arrResult[1]);
							})
		
						}).catch(function(arrResult) {
							self.log('error', arrResult[0].host + ':' + arrResult[0].port + ' - ' + arrResult[1]);
						});
					}
		
				} else {
					// Absolute opacity.
					self.doCommand('/opacity/layer/' + self.checkLayerId(idx), { value: self.formatOpacity(opacity) });
				}
		
			}
		};
		
		actions.trackMatte = {
			name: 'Track Matte',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '1'
				},
				{
					type: 'dropdown',
					label: 'Track Matte',
					id: 'trackMatte',
					default: 'Alpha Matte',
					choices: [
						{ id:'Alpha Matte', label:'Alpha Matte' },
						{ id:'Luma Matte', label:'Luma Matte' },
						{ id:'White Matte', label:'White Matte' },
					]
				},
				{
					type: 'checkbox',
					label: 'Invert Matte',
					id: 'invert',
					default: false,
					tooltip: 'Check to invert the track matte'
				}
			],
			callback: async function (action) {
				// PVP 3.3.1: The API for layer blending (/blend/layer/) is either broken or incorrectly documented.
				//	This endpoint works but isn't officially documented anywhere.
		
				let idx = await self.parseVariablesInString(action.options.idx);
				let opt = action.options;
		
				var trackMatte = {
					type: opt.trackMatte,
					base: { }
				};
		
				if (opt.trackMatte === 'Alpha Matte' || opt.trackMatte === 'Luma Matte') {
					// Only these track matte modes support the isInverted property. Add to object.
					trackMatte.base.isInverted = opt.invert;
				}
		
				self.doCommand('/layerBlend/layer/' + self.checkLayerId(idx), trackMatte);
			}
		};
		
		actions.blendMode = {
			name: 'Layer Blend Mode',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				},
				{
					type: 'dropdown',
					label: 'Blend Mode',
					id: 'blendMode',
					default: 'Normal',
					choices: [
						{ id:'Normal', label:'Normal' },
						{ id:'Dissolve', label:'Dissolve' },
						{ id:'Darken', label:'Darken' },
						{ id:'Multiply', label:'Multiply' },
						{ id:'Color Burn', label:'Color Burn' },
						{ id:'Linear Burn', label:'Linear Burn' },
						{ id:'Darker Color', label:'Darker Color' },
						{ id:'Lighten', label:'Lighten' },
						{ id:'Screen', label:'Screen' },
						{ id:'Color Dodge', label:'Color Dodge' },
						{ id:'Linear Dodge', label:'Linear Dodge' },
						{ id:'Lighter Color', label:'Lighter Color' },
						{ id:'Overlay', label:'Overlay' },
						{ id:'Soft Light', label:'Soft Light' },
						{ id:'Hard Light', label:'Hard Light' },
						{ id:'Vivid Light', label:'Vivid Light' },
						{ id:'Linear Light', label:'Linear Light' },
						{ id:'Pin Light', label:'Pin Light' },
						{ id:'Hard Mix', label:'Hard Mix' },
						{ id:'Difference', label:'Difference' },
						{ id:'Exclusion', label:'Exclusion' },
						{ id:'Subtract', label:'Subtract' },
						{ id:'Divide', label:'Divide' },
						{ id:'Hue', label:'Hue' },
						{ id:'Saturation', label:'Saturation' },
						{ id:'Color', label:'Color' },
						{ id:'Luminosity', label:'Luminosity' },
					]
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				let opt = action.options;
				self.doCommand('/blendMode/layer/' + self.checkLayerId(idx), { value: opt.blendMode });
			}
		};
		
		actions.clearWs = {
			name: 'Clear Workspace',
			options: [],
			callback: async function (action) {
				self.doCommand('/clear/workspace');
			}
		};
		
		actions.hideWs = {
			name: 'Hide Workspace',
			options: [],
			callback: async function (action) {
				self.doCommand('/hide/workspace');
			}
		};
		
		actions.unhideWs = {
			name: 'Unhide Workspace',
			options: [],
			callback: async function (action) {
				self.doCommand('/unhide/workspace');
			}
		};
		
		actions.muteWs = {
			name: 'Mute Workspace',
			options: [],
			callback: async function (action) {
				self.doCommand('/mute/workspace');
			}
		};
		
		actions.unmuteWs = {
			name: 'Unmute Workspace',
			options: [],
			callback: async function (action) {
				self.doCommand('/unmute/workspace');
			}
		};
		
		actions.workspaceEffectPreset = {
			name: 'Workspace Effect Preset',
			options: [
				{
					type: 'textinput',
					label: 'Effect Preset Name',
					id: 'epn',
					default: ''
				}
			],
			callback: async function (action) {
				let epn = await self.parseVariablesInString(action.options.epn);
				self.doCommand('/effectsPreset/workspace', { value: epn });
				if (epn === '') {
					// This will clear all the effects from the workspace
					self.doCommand('/effects/workspace', { });
				}
			}
		};
		
		actions.pauseLayer = {
			name: 'Pause Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				self.doCommand('/pause/layer/' + self.checkLayerId(idx), { });
			}
		};
		
		actions.playLayer = {
			name: 'Play Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				self.doCommand('/play/layer/' + self.checkLayerId(idx), { });
			}
		};
		
		actions.goToLayerOffset = {
			name: 'Go to Layer Offset (Seconds)',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Offset (+/- seconds)',
					id: 'offset',
					default: '-10',
					regex : '/^-?\\d+(.\\d+)?$/'
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				let offset = await self.parseVariablesInString(action.options.offset);
		
				offset = parseFloat(opt.offset);
				// offset >= 0 track the video ahead from the start ("2" tracks to 2 seconds from the start of the video).
				// offset <  0 track the video back from the end ("-2" tracks to seconds from the end of the video).
				// "-0[.0]" is a special case (which is why it's matched as a string) and it tracks the video to the very end.
				 const goToDest = opt.offset[0] !== '-' ? 'goToStart' : 'goToEnd';
				if (!isNaN(offset)) {
					self.doCommand('/'+goToDest+'/layer/' + self.checkLayerId(idx) + '?offset='+Math.abs(offset), { });
				}
			}
		};
		
		actions.skipLayerSeconds = {
			name: 'Skip Media in Layer (Seconds)',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Seconds (+/- seconds)',
					id: 'sec',
					default: '15.0',
					regex : '/^-?\\d+(.\\d+)?$/'
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				let sec = await self.parseVariablesInString(action.options.sec);
		
				sec = parseFloat(opt.sec);
				const isForwards = sec >= 0 ? 'true' : 'false';
				if (sec !== 0 && !isNaN(sec)) {
					self.doCommand('/skip/layer/' + self.checkLayerId(idx) + '?forwards='+isForwards + '&offset='+Math.abs(sec), { });
				}
			}
		};
		
		actions.layerTransitionDuration = {
			name: 'Layer Transition Duration (Seconds)',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID',
					id: 'idx',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Seconds (0-5 seconds)',
					id: 'sec',
					default: '1.0',
					regex : '/^\\d+(.\\d+)?$/'
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				let sec = await self.parseVariablesInString(action.options.sec);
		
				sec = parseFloat(sec);
				// API specifies the value must be between 0.0 and 5.0.
				sec = Math.min(Math.max(0.0, sec), 5.0);
		
				self.doCommand('/transitionDuration/layer/' + self.checkLayerId(idx), { "value" : sec });
			}
		};
		
		actions.workspaceTransitionDuration = {
			name: 'Workspace Transition Duration (Seconds)',
			options: [
				{
					type: 'textinput',
					label: 'Seconds (0-5 seconds)',
					id: 'sec',
					default: '1.0',
					regex : '/^\\d+(.\\d+)?$/'
				}
			],
			callback: async function (action) {
				let idx = await self.parseVariablesInString(action.options.idx);
				let sec = await self.parseVariablesInString(action.options.sec);
		
				sec = parseFloat(sec);
				// API specifies the value must be between 0.0 and 5.0.
				sec = Math.min(Math.max(0.0, sec), 5.0);
		
				self.doCommand('/transitionDuration/workspace', { "value" : sec });
			}
		};

		self.setActionDefinitions(actions);
	}
}