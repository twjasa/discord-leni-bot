function isAskingLeni(message) {
	return [`<@${process.env.botId}>`, `<@&${process.env.mentionLeni}>`].includes(
		message,
	);
}

// TODO: Once we have classrooms id we can put them in the .env file and use it here
// eslint-disable-next-line no-unused-vars
function isAskingInAClassroom(message) {
	return process.env.CLASSROOM_IDS.includes(
		message?.channelId,
	);
}

function getQuestion(message) {
	return message.content.slice(23);
}

module.exports = {
	isAskingLeni,
	isAskingInAClassroom,
	getQuestion,
};
