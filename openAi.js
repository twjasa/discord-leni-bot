const { encode } = require('gpt-3-encoder');

function countTokens(text) {
	const tokens = encode(text);
	return tokens.length;
}

async function getChatCompletion(message) {
	const url = 'https://api.openai.com/v1/chat/completions';
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
	};

	const data = {
		model: 'gpt-3.5-turbo',
		messages: [
			{ role: 'system', content: process.env.SYSTEM_PROMPT },
			...message,
		],
	};

	try {
		const tokens = countTokens(
			data.messages.reduce((final, current) => {
				return final + current.content;
			}, ''),
		);

		if (tokens > 3000) {
			if (message.length > 1) {
				return 'Sorry, I can\'t respond anymore in this thread. 🙅‍♂️ Please start a new thread to begin a fresh conversation. 🌟💬';
			}

			return '📝 "Oops, message too long! Can you be briefer, please? 😅"';
		}

		const response = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(data),
		});

		const json = await response.json();
		return json?.choices?.[0].message?.content;
	}
	catch (error) {
		console.error('Error:', error.message);
		return null;
	}
}
module.exports = { getChatCompletion, countTokens };
