const { Client } = require('discord.js')
const Roblox = require('noblox.js')
const { Token, Cookie, GroupId } = require("../config.json")
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const rest = new REST({version: '9'}).setToken(Token)

/**
 * 
 * @param {Client} bot
 */
module.exports.execute = async (bot) => {
    console.log(`${bot.user.tag} has logged in.`)
	bot.user.setActivity({name: 'Your Server', type: 'WATCHING'})

        try {

            const user = await Roblox.setCookie(Cookie)
            console.log(`Logged into ${user.UserName} ${user.UserID}`)

            const serverid = '1052457698240757810'

			console.log('Started Refreshing Slash Commands')

			await rest.put(Routes.applicationGuildCommands(bot.user.id, serverid), {
				body : bot.slashcommands,
			})

			console.log('Refreshed Slash Commands')

			const guild = bot.guilds.cache.get(serverid)

			// const commandPermissions = [
			// 	{
			// 	  	commandId: '1147369813421867019', // Promote Command
			// 	  	roleId: '1052460477659217940',
			// 	  	type: 'ROLE',
			// 	  	permission: true,
			// 	},
			// 	{
			// 	  	commandId: '1148019021850099744', // Demote Command
			// 	  	roleId: '1052460477659217940',
			// 	  	type: 'ROLE',
			// 	  	permission: true,
			// 	},
			// 	{
			// 		commandId: '1148027371245543544', // Rank Command
			// 		roleId: '1052460477659217940',
			// 		type: 'ROLE',
			// 		permission: true,
			// 	},
			// 	{
			// 		commandId: '1148031200934494238', // AddXP Command
			// 		roleId: '1052460477659217940',
			// 		type: 'ROLE',
			// 		permission: true,
			// 	},
			//   ];

			const rankcommands = ['1147369813421867019', '1148019021850099744', '1148027371245543544', '1148031200934494238']

			  for (const commandid of rankcommands ) {
				await guild.commands.permissions.add({
				  command: commandid,
				  permissions: [
					{
					  id: '1052460477659217940',
					  type: 'ROLE',
					  permission: true,
					},
				  ],
				})
			  }

			//  const roles = await Roblox.getRoles(GroupId)
			//  const arr = []

			//  roles.forEach(role => arr.push([role.name , role.rank]))

			//	console.log(JSON.stringify(arr))
		} catch (error) {
			console.log(error)
		}
}