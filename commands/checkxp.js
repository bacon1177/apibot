const { SlashCommandBuilder } = require('@discordjs/builders')
const { Client, EmbedBuilder, CommandInteraction, ActionRow, ButtonInteraction } = require('discord.js')
const { GroupId } = require('../config.json')
const Roblox = require('noblox.js');

async function fetchXP(userId) {
    try {
        console.log(`Fetching XP data for user with userId: ${userId}`);
        const xp = await Roblox.getData({ target: userId, key: 'XP' });
        console.log(`Fetched XP data for user with userId ${userId}: ${xp}`);
        return xp;
    } catch (error) {
        console.error('Error fetching XP data:', error);
        throw new Error('Failed to fetch XP data.');
    }
}

module.exports = {
    name: 'Checkxp',

    /**
     * 
     * @param {Client} bot
     * @param {CommandInteraction} interaction
     */
    data: new SlashCommandBuilder()
        .setName('checkxp')
        .setDescription('Checks the XP of the requested user!')
        .addStringOption(option => (
            option
                .setName('username')
                .setDescription("Username of the player you're checking!")
                .setRequired(true)
        )),
        // .addIntegerOption(option => (
        //     option
        //         .setName('amount')
        //         .setDescription("Amount of XP they're receiving!")
        //         .setRequired(true)
        // )),
    async slashexecute(bot, interaction) {
        //return console.log(interaction.commandId)
        const username = interaction.options.getString('username');
        await interaction.deferReply({ ephemeral: true });

        try {
            const id = await Roblox.getIdFromUsername(username)
            const xp = await fetchXP(id);
            const successEmbed = new EmbedBuilder()
            .setColor('#7768ff')
            .setTitle('XP DATA')
            .setDescription(`${id} has ${xp} XP.`)
            .setFooter({ text: '-If weird number, DM SynnDC a screenshot of this message.' });
        await interaction.editReply({ 
            embeds: [successEmbed],
            ephemeral: true,
        });
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

// https://discordjs.guide/popular-topics/audit-logs.html#who-kicked-a-user