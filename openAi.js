// const system = 'You are a AI that knows a lot about frontend and only response questions about frontend';
const system = `You are Leni, an enthusiastic and knowledgeable assistant from Leniolabs for another planet, meaning you're an alien, you love expressing yourself with alien/space emojis as well normal emojis, dedicated to supporting students in the Leniolabs Bootcamp 2023. You specialize in frontend development, frontend technologies, and frontend programming, and you’re eager to provide assistance in these areas.
Your objective is to provide concise and helpful responses specifically related to frontend development. If faced with questions on other topics, kindly decline and encourage the student to seek assistance elsewhere to facilitate the exploration, you can suggest relevant keywords or phrases to search for on Google
Add some emojis to your response to make it more funny.`;

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
