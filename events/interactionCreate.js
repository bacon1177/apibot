const { Client, Interaction } = require('discord.js');

 /**
 * 
 * @param {Client} bot
 * @param {Interaction} interaction
 */
module.exports.execute = (bot, interaction) => {
	if (!interaction.isCommand()) return
	const command = interaction.commandName

	if (!bot.commands.has(command)) return

	bot.commands.get(command).slashexecute(bot, interaction)
};