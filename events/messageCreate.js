const { Events } = require('discord.js');

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
			const res = await fetch(
				'https://run.mocky.io/v3/7387588a-565e-46ba-b032-8e44f4189a2f?mocky-delay=2000ms',
			);
			const data = await res?.json();
			loadingMessage?.edit(`Hello, ${data.response}!`);
		});
	},
};
