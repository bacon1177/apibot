const { SlashCommandBuilder } = require('@discordjs/builders')
const { Client, EmbedBuilder, CommandInteraction, ActionRow, ButtonInteraction, Embed } = require('discord.js')
const { GroupId, Ranks } = require('../config.json')
const Roblox = require('noblox.js');

module.exports = {
    name: 'Rank',

    /**
     * 
     * @param {Client} bot
     * @param {CommandInteraction} interaction
     */
    data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Ranks the requested user(s)!')
    .addStringOption(option =>
            option
                .setName('usernames')
                .setDescription("Usernames of the players you're ranking, separated by commas.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('rank')
                .setDescription("Rank you want to rank player.")
                .setRequired(true)
                .addChoices(                    
                    { name: 'Foundation Member', value: 1 },
                    { name: 'Gameplay Staff', value: 251 },
                    { name: '───── HRs ─────', value: 252 }
                )
        ),
    async slashexecute(bot, interaction) {
        //return console.log(interaction.commandId)
        const usernames = interaction.options.getString('usernames').split(',').map(username => username.trim());
        const rank = interaction.options.getInteger('rank');
        await interaction.deferReply({ ephemeral: true });

        try {
            const results = [];
            for (const username of usernames) {
                const id = await Roblox.getIdFromUsername(username.trim());
                console.log('Processing username:', username);
                console.log('User ID:', id);

                const response = await Roblox.setRank(GroupId, id, rank);
                console.log('Response from setRank:', await response);

                const successEmbed = new EmbedBuilder()
                    .setColor('#7768ff')
                    .setTitle('Ranked Successfully')
                    .setDescription(`Successfully ranked **${username}** to the specified rank!`)
                    .setFooter({ text: '-Make sure to check the group in-case of any mess-up.' });
                await interaction.followUp({ embeds: [successEmbed], ephemeral: true });
            }

            if (results.length > 0) {
                const resultsEmbed = new EmbedBuilder()
                    .setColor('#7768ff')
                    .setTitle('Some Rank Operations Failed')
                    .setDescription(results.join('\n'));
                await interaction.followUp({
                    embeds: [resultsEmbed],
                    ephemeral: true,
                });
            }
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
    },
};