const { Events } = require('discord.js');
const cron = require('cron');
const db = require('../DB');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute() {
		console.log('Ready 🚀');
		const scheduledMessage = new cron.CronJob('0 2 * * *', () => {
			// This runs every day at 10:30:00, you can do anything you want
			// const channel = client.channels.cache.get("903474270653534210");
			// channel.send(eval(`hola cada 10 segundos`));
			db.dropTable()
				.then(() => console.log('Table dropped'))
				.catch((err) => console.log(err));
		});
		scheduledMessage.start();
	},
};
