/* eslint-disable no-mixed-spaces-and-tabs */
const { Events } = require('discord.js');
const { getChatCompletion } = require('../openAi');
const db = require('../DB');
const {
	getQuestion,
	isAskingInForbiddenChannel,
	isAskingLeni,
} = require('../utils/chat-utils.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const startMessage = message.content.slice(0, 23).trim();
		const question = getQuestion(message);

		if (!isAskingLeni(startMessage)) {
			return false;
		}
		if (isAskingInForbiddenChannel(message)) {
			return message.channel?.send(
				'Please direct your questions to the classroom channel exclusively. Thank you. 👽',
			);
		}
		let messageToSend = [{ role: 'user', content: question }];
		if (message.channel.type !== 0) {
			const historyMessage = await message?.channel?.messages?.fetch();
			const starterMessage = await message?.channel?.messages?.fetch(
				message?.channel?.id,
			);

			if (historyMessage) {
				const history = historyMessage
					.map(({ author, content }) => {
						const role = [process.env.botId, process.env.mentionLeni].includes(
							author?.id,
						)
							? 'assistant'
							: 'user';

						if (content === '') return { content: '' };
						if (role === 'user' && !isAskingLeni(content.slice(0, 23).trim())) {
							return { content: '' };
						}

						return {
							role,
							content: content
								.replace(`<@${process.env.botId}>`, '')
								.replace(`<@&${process.env.mentionLeni}>`, ''),
						};
					})
					.filter(({ content }) => content !== '');

				history.push({
					role: [process.env.botId, process.env.mentionLeni].includes(
						starterMessage.author?.id,
					)
						? 'assistant'
						: 'user',
					content: starterMessage.content,
				});
				// history.push({ role: 'user', content: message.content });

				history.reverse();
				messageToSend = history;
			}
		}
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

			const response = await getChatCompletion(messageToSend);
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
