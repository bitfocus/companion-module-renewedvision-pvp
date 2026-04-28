const { getPvpState } = require('./variables-api')
const {
	buildVariableDefinitions,
	buildVariableValues,
	structureSignature,
} = require('./variables-core')

function emptyPvpState() {
	return {
		playlists: [],
		layers: [],
		workspaceTransport: [],
		workspaceEffects: [],
		targetSets: [],
		blendModes: [],
		layerPresets: [],
		effectPresets: [],
		transitions: [],
		availableEffects: [],
		lastPollTime: undefined,
		lastPollError: undefined,
	}
}

function getPrimaryVariableTarget(self) {
	const target = self.arrTargets && self.arrTargets[0]
	if (!target) return undefined

	return {
		config: {
			host: target.host,
			port: Number(target.port),
			useHttps: Boolean(target.https),
			pollIntervalMs: Number(self.config.variable_poll_interval_ms || 750),
		},
		secrets: {
			token: target.auth || '',
		},
	}
}

module.exports = {
	initVariables: function () {
		let self = this

		self.pvpVariablesState = self.pvpVariablesState || emptyPvpState()
		self.pvpVariablesSignature = ''

		self.setVariableDefinitions(buildVariableDefinitions(self.pvpVariablesState))
		self.setVariableValues(buildVariableValues(self.pvpVariablesState))
	},

	startVariablesPolling: function () {
		let self = this

		if (self.VARIABLES_INTERVAL) {
			clearInterval(self.VARIABLES_INTERVAL)
			self.VARIABLES_INTERVAL = null
		}

		const interval = Math.max(250, Number(self.config.variable_poll_interval_ms || 750))

		self.checkVariables()
		self.VARIABLES_INTERVAL = setInterval(() => {
			self.checkVariables()
		}, interval)
	},

	stopVariablesPolling: function () {
		let self = this

		if (self.VARIABLES_INTERVAL) {
			clearInterval(self.VARIABLES_INTERVAL)
			self.VARIABLES_INTERVAL = null
		}
	},

	getPvpVariablesState: function () {
		return this.pvpVariablesState || emptyPvpState()
	},

	checkVariables: async function () {
		let self = this

		try {
			const target = getPrimaryVariableTarget(self)
			if (!target) {
				self.pvpVariablesState = {
					...emptyPvpState(),
					lastPollError: 'No valid PVP instance configured',
				}
				self.setVariableValues(buildVariableValues(self.pvpVariablesState))
				self.checkFeedbacks()
				return
			}

			const state = await getPvpState(target.config, target.secrets)
			self.pvpVariablesState = state

			const nextSignature = structureSignature(state)
			if (nextSignature !== self.pvpVariablesSignature) {
				self.pvpVariablesSignature = nextSignature
				self.setVariableDefinitions(buildVariableDefinitions(state))
			}

			self.setVariableValues(buildVariableValues(state))
			self.checkFeedbacks()
		}
		catch(error) {
			const previousState = self.pvpVariablesState || emptyPvpState()
			self.pvpVariablesState = {
				...previousState,
				lastPollError: error instanceof Error ? error.message : String(error),
			}
			self.setVariableValues(buildVariableValues(self.pvpVariablesState))
			self.checkFeedbacks()

			if (self.config.verbose) {
				self.log('error', 'Error setting PVP variables: ' + self.pvpVariablesState.lastPollError)
			}
		}
	}
}
