function isAskingLeni(message) {
	return [`<@${process.env.botId}>`, `<@&${process.env.mentionLeni}>`].includes(
		message,
	);
}

// eslint-disable-next-line no-unused-vars
function isAskingInAClassroom(message) {
	return true;
	// if (!process.env.CLASSROOM_IDS) {
	// 	return false;
	// }
	// return process.env.CLASSROOM_IDS.some(id => id === message.channelID);
}

function getQuestion(message) {
	return message.content.slice(23);
}

module.exports = {
	isAskingLeni,
	isAskingInAClassroom,
	getQuestion,
};

