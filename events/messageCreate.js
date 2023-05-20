const { Events } = require('discord.js');
const getChatCompletion = require('../openAi');
const db = require('../DB');
const {
	getQuestion,
	isAskingInAClassroom,
	isAskingLeni,
} = require('../utils/chat-utils.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const startMessage = message.content.slice(0, 23).trim();
		console.log('🔧 message', message.content);

		if (!isAskingLeni(startMessage) || !isAskingInAClassroom()) {
			return false;
		}

		console.log('🗣  mentioned: ', message.author.tag);

		const loadingMessage = await message.channel?.send('🧠 Thinking...');
		try {
			await db.open();
			const user = await db.get(message.author.tag);

			if (!user) {
				await db.create(message.author.tag, 0);
			}

			if (user?.qty >= 10) {
				loadingMessage.delete();
				message.channel.send(
					`👽 Hi ${message.author.tag} you don't have questions left. Try again tomorrow.`,
				);
				return db.close();
			}

			const question = getQuestion(message);
			const response = await getChatCompletion(question);
			loadingMessage.delete();
			if (!response) {
				message.channel.send('😵‍💫 I can\'t response your question now.');
				return db.close();
			}
			message.channel.send(response);
			await db.modify(message.author.tag, (user?.qty || 0) + 1);
			return db.close();
		}
		catch (error) {
			console.log('  error: ', error);
			loadingMessage.delete();
			message.channel.send('😵‍💫 I can\'t response your question now.');
			return db.close();
		}
	},
};
