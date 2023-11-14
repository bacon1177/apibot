const { SlashCommandBuilder } = require('@discordjs/builders')
const { Client, EmbedBuilder, CommandInteraction, ActionRow, ButtonInteraction } = require('discord.js')
const { GroupId } = require('../config.json')
const Roblox = require('noblox.js');

module.exports = {
    name: 'Promote',

    /**
     * 
     * @param {Client} bot
     * @param {CommandInteraction} interaction
     */
    data: new SlashCommandBuilder()
        .setName('promote')
        .setDescription('Promotes the requested user!')
        .addStringOption(option => (
            option
                .setName('username')
                .setDescription("Username of the player you're promoting!")
                .setRequired(true)
        )),
    async slashexecute(bot, interaction) {
        //return console.log(interaction.commandId)
        const username = interaction.options.getString('username');
        await interaction.deferReply({ ephemeral: true });

        try {
            const id = await Roblox.getIdFromUsername(username)
            const { newRole } = await Roblox.promote(GroupId, id)
            const successEmbed = new EmbedBuilder()
                .setColor('#7768ff')
                .setTitle('Promoted Successfully')
                .setDescription(`Successfully promoted **${username}** to "**${newRole.name}**"!`)
                .setFooter({ text: '-Make sure to check the group in-case of any mess-up.' });
            await interaction.editReply({ 
                embeds: [successEmbed],
                ephemeral: true, 
            });
            setTimeout(async () => {
                await interaction.deleteReply();
            }, 600000);
        } catch (error) {
            console.error('Error:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff2d2d')
                .setTitle('Error Occurred:')
                .setDescription(error.message)
                .setFooter({ text:'Contact SynnDC with a screenshot of this.' });
            await interaction.followUp({
                embeds: [errorEmbed],
                ephemeral: true,
            });
        }
    }
};
