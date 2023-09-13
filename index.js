const { Client, GatewayIntentBits } = require('discord.js');
const { Token } = require('./config.json')
const { readdirSync } = require('fs');

require('better-logging')(console);
require('dotenv').config();

const bot = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

bot.commands = new Map();
bot.slashcommands = []

//const foldersPath = path.join(__dirname, 'commands');
//const commandFolders = fs.readdirSync(foldersPath);

//for (const folder of commandFolders) {
//	const commandsPath = path.join(foldersPath, folder);
//	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
//	for (const file of commandFiles) {
//		const filePath = path.join(commandsPath, file);
//		const command = require(filePath);
//		if ('data' in command && 'execute' in command) {
//			client.commands.set(command.data.name, command);
//		} else {
//			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
//		}
//	}
//}

const commands = readdirSync('./commands').filter(file => 
	file.endsWith('.js')
);

for (const command of commands) {
	const file = require(`./commands/${command}`)
	bot.commands.set(file.name.toLowerCase(), file)

	if (file.data) {
		bot.slashcommands.push(file.data)
	}
}

const events = readdirSync('./Events')

for (const event of events) {
	const file = require(`./events/${event}`)
	const name = event.split('.')[0]

	bot.on(name, file.execute.bind(null, bot))
}

bot.login(Token);