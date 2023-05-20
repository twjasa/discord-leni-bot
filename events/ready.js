const { Events } = require('discord.js');
const cron = require('cron');
const db = require('../DB');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute() {
		console.log('Ready 🚀');
		const scheduledMessage = new cron.CronJob(process.env.CRON_JOB_TIME, () => {
			// const channel = client.channels.cache.get(process.env.channel_general);
			// channel.send(eval(`Hi each 10 seg`));
			db.dropTable()
				.then(() => console.log('Table dropped'))
				.catch((err) => console.log(err));
		});
		scheduledMessage.start();
	},
};
