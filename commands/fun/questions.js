const { SlashCommandBuilder } = require('discord.js');
const db = require('../../DB');

function formatMilliseconds(ms) {
	const totalSeconds = Math.floor(ms / 1000);
	const totalMinutes = Math.floor(totalSeconds / 60);
	const totalHours = Math.floor(totalMinutes / 60);

	const seconds = totalSeconds % 60;
	const minutes = totalMinutes % 60;
	const hours = totalHours;

	return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
}

function getNextScheduledTime() {
	const [minute, hour] = process.env.CRON_JOB_TIME.split(' ').map(Number);
	const now = new Date();
	const nextScheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);

	if (now > nextScheduledTime) {
		// If the current time is after the next scheduled time, the next scheduled time is tomorrow.
		nextScheduledTime.setDate(nextScheduledTime.getDate() + 1);
	}

	return nextScheduledTime;
}


function calculateTimeRemaining() {
	const now = new Date();
	const nextScheduledTime = getNextScheduledTime();

	const timeRemaining = nextScheduledTime - now;

	return formatMilliseconds(timeRemaining);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('questions')
		.setDescription(
			'Replies the questions left for today and the time left after rest',
		),
	async execute(interaction) {
		await db.open();
		const { user: interactionUser } = interaction;
		const userName = `${interactionUser?.username}#${interactionUser?.discriminator}`;
		const user = await db.get(userName);
		const questionLeft = 10 - (user?.qty || 0);

		const haveQuestionsMessage = `You have ${questionLeft} ${
			(user?.qty || 0) === 1 ? 'questions' : 'questions'
		} remaining.`;
		const noQuestionMessage = '🚀 No questions remaining.';
		await interaction.reply({
			content: `${questionLeft <= 0 ? noQuestionMessage : haveQuestionsMessage}
			
⏳ Next reset in:  ${calculateTimeRemaining()}.`,
			ephemeral: true,
		});
		await db.close();
	},
};
