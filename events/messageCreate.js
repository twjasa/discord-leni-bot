const { Events } = require("discord.js");
const { clientId } = require("../config.json");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (!message.content.includes(`<@${clientId}`)) return false;
    console.log(`me mencionaron`);
  },
};
