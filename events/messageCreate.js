const { Events } = require('discord.js');
const getChatCompletion = require('../openAi');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const startMessage = message.content.slice(0, 23).trim();
		console.log('🔧 message', message.content);

		if (
			![`<@${process.env.botId}>`, `<@&${process.env.mentionLeni}>`].includes(
				startMessage,
			)
		) {
			return false;
		}

		const loadingMessage = await message.channel?.send('🧠 Thinking...');
		const response = await getChatCompletion(message.content.slice(23));

		loadingMessage?.edit(response || '🧠 Thinking...');
		if (!response) {
			loadingMessage?.edit('😵‍💫 I can\'t response your question now');
		}

		return loadingMessage;
	},
};
