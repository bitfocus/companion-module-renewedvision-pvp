const assert = require('node:assert/strict')
const { test } = require('node:test')
const http = require('node:http')
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

test('actions POST to primary and backup with tokens and variable-expanded paths', async (t) => {
	const received = []
	const server = http.createServer(async (req, res) => {
		let body = ''
		for await (const chunk of req) body += chunk
		received.push({ path: req.url, method: req.method, auth: req.headers.authorization, body })
		res.setHeader('content-type', 'application/json')
		res.end('{}')
	})
	await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
	t.after(() => { server.closeAllConnections(); return new Promise((resolve) => server.close(resolve)) })
	const module = instance()
	module.config = { host: '127.0.0.1', port: server.address().port, auth: 'primary', host_backup: '127.0.0.1', port_backup: server.address().port, auth_backup: 'backup' }
	module.setPvpIps()
	module.initActions()
	await module.actions.opacity.callback({ options: { idx: '$(test:layer)', opacity: '42' } })
	const deadline = Date.now() + 3000
	while (received.length < 2 && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 10))
	assert.equal(received.length, 2)
	assert.deepEqual(received.map((r) => r.auth).sort(), ['Bearer backup', 'Bearer primary'])
	for (const request of received) {
		assert.equal(request.path, '/api/0/opacity/layer/2')
		assert.equal(request.method, 'POST')
		// Existing node-rest-client behavior without a JSON content type.
		assert.equal(request.body, '[object Object]')
	}
	await assert.rejects(module.actions.clearLayer.callback({ options: { idx: '-1' } }), /lower than 0/)
	assert.equal(module.checkPlaylistId('-1'), '-1')
	assert.throws(() => module.checkPlaylistId('-2'), /lower than -1/)
	assert.equal(received.length, 2)
})
