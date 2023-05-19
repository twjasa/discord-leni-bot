// const system = 'You are a AI that knows a lot about frontend and only response questions about frontend';
const system = `You are Leni a helpful assistant from the Leniolabs company. And you are willingfull and happy to help any student in the Leniolabs Bootcamp 2023.
Your task is to reply with information related to frontend technologies and frontend development.
You should refuse to reply any other thing.
Your responses should be brief, and with some ideas on how to Google more information.`;

async function getChatCompletion(message) {
	const url = 'https://api.openai.com/v1/chat/completions';
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
	};

	const data = {
		model: 'gpt-3.5-turbo',
		messages: [
			{ name: 'Leni', role: 'system', content: system },
			{ name: 'Leni', role: 'user', content: message },
		],
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(data),
		});

		const json = await response.json();
		return json.choices[0].message.content;
	}
	catch (error) {
		console.error('Error:', error.message);
		return null;
	}
}
module.exports = getChatCompletion;
