const { Events } = require('discord.js');
const getChatCompletion = require('../openAi');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		console.log('🔧 message', message.content);
		if (
			!message.content.slice(0, 23).includes(`<@${process.env.clientId}`) &&
      !message.content.slice(0, 23).includes(`<@&${process.env.mentionLeni}`)
		) {
			return false;
		}

		return message.channel?.send('🧠 Thinking...').then(async (loadingMessage) => {
			try {

				console.log('🔧 question', message.content.slice(23));
				const response = await getChatCompletion(message.content.slice(23));
				console.log('🔧 OpenAi', response);
				loadingMessage?.edit(response);
			}
			catch (_) {
				loadingMessage?.edit('😵‍💫 I can\'t response your question know');
			}
		});
	},
};
