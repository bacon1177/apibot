const { SlashCommandBuilder } = require('@discordjs/builders')
const { Client, EmbedBuilder, CommandInteraction, ActionRow, ButtonInteraction } = require('discord.js')
const { GroupId } = require('../config.json')
const Roblox = require('noblox.js');

let choices = [];

// async function fetchUsernamesFromRoblox(GroupId) {
//     const apiUrl = `https://api.roblox.com/groups/${GroupId}/members`;

//     try {
//         const response = await fetch(apiUrl);
//         if (!response.ok) {
//             throw new Error(`Failed to fetch group members. Status: ${response.status}`);
//         }
//         const members = await response.json();
//         const usernames = members.map(member => member.username);
//         choices = usernames.map(username => ({
//             name: username,
//             value: username,
//         }));
//         console.log('Usernames updated:', choices);
//     } catch (error) {
//         throw new Error(`Error fetching usernames from Roblox: ${error.message}`);
//     }
// }

// setInterval(async () => {
//     try {
//         await fetchUsernamesFromRoblox(GroupId);
//     } catch (error) {
//         console.error('Error updating usernames:', error);
//     }
// }, 30 * 60 * 1000);


module.exports = {
    name: 'Demote',

    /**
     * 
     * @param {Client} bot
     * @param {CommandInteraction} interaction
     */
    data: new SlashCommandBuilder()
        .setName('demote')
        .setDescription('Demotes the requested user!')
        .addStringOption(option => (
            option
                .setName('username')
                .setDescription("Username of the player you're demoting!")
                .setRequired(true)
                // .setChoices(choices)
        )),
    async slashexecute(bot, interaction) {
        //return console.log(interaction.commandId)
        const username = interaction.options.getString('username');
        await interaction.deferReply({ ephemeral: true });

        try {
            const id = await Roblox.getIdFromUsername(username)
            const { newRole } = await Roblox.demote(GroupId, id)
            const successEmbed = new EmbedBuilder()
                .setColor('#7768ff')
                .setTitle('Demoted Successfully')
                .setDescription(`Successfully demoted **${username}** to "**${newRole.name}**"!`)
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

// https://discordjs.guide/popular-topics/audit-logs.html#who-kicked-a-user