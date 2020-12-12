const moment = require('moment');
const momentTimeZone = require('moment-timezone');

function formatMessage(username,text) {
	return {
		username,
		text,
		time:moment().format('hh:mm a z')
	}
}

module.exports = formatMessage;