const { SlashCommandBuilder } = require('discord.js');

// WIP we should ask HR what info they think that will be useful to the students.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('information')
		.setDescription('Replies with information that may be useful for you 🚀'),
	async execute(interaction) {
		await interaction.reply({
			content: `
      LenioLabs_ bootcamp page: https://bootcamp.leniolabs.com/
    `,
			ephemeral: true,
		});
	},
};
