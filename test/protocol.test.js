const assert = require('node:assert/strict')
const { test } = require('node:test')
const api = require('../src/api')
const actions = require('../src/actions')

function instance() {
	return {
		...api, ...actions,
		log() {}, updateStatus() {}, checkFeedbacks() {}, checkVariables() {},
		// API 1.13+ rejects non-string values, including absent options.
		async parseVariablesInString(value) {
			assert.equal(typeof value, 'string')
			return value.replace('$(test:layer)', '2')
		},
		setActionDefinitions(definitions) { this.actions = definitions },
	}
}

test('workspace duration needs only seconds and clamps the API payload', async () => {
	const module = instance()
	const sent = []
	module.doCommand = (...args) => sent.push(args)
	module.initActions()
	await module.actions.workspaceTransitionDuration.callback({ options: { sec: '9' } })
	await module.actions.workspaceTransitionDuration.callback({ options: { sec: '-1' } })
	assert.deepEqual(sent, [
		['/transitionDuration/workspace', { value: 5 }],
		['/transitionDuration/workspace', { value: 0 }],
	])
})

