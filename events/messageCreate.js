const { Events } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
		return message.channel?.send('Thinking...').then(async (loadingMessage) => {
			const completion = await openai.createCompletion({
				model: 'text-davinci-003',
				prompt: message.content.slice(0, 23),
			});
			console.log('🔧 OpenAi', completion.data.choices);
			loadingMessage?.edit(`Hello, ${completion.data.choices[0].text}!`);
		});
	},
};
