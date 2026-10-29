const { getFeedbackDefinitions } = require('./feedbacks-core')

module.exports = {
	initFeedbacks: function () {
		let self = this

		self.setFeedbackDefinitions(getFeedbackDefinitions(() => self.getPvpVariablesState()))
	}
}
