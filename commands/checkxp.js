const { SlashCommandBuilder } = require('@discordjs/builders')
const { Client, EmbedBuilder, CommandInteraction, ActionRow, ButtonInteraction } = require('discord.js')
const { GroupId } = require('../config.json')
const Roblox = require('noblox.js');

const express = require('express');
var bodyParser = require('body-parser');
const https = require('https');
const app = express();

const Invalid = new MessageEmbed()
  .setColor('#eb4034')
  .setDescription("Invalid user")

var toGet = [];
function byUID(method,usr,message) {
  const Emb = new MessageEmbed()
      .setColor('#fff200')
      //.setTitle(request.headers.username + "'s Data")
      //.setTitle("Attempt")
      //.setAuthor('Roblox Error','')
      .setDescription("Attempting to "+method+" UserID "+ usr +"...")
      .setTimestamp()
      .setFooter('Developed by Stratiz');
    message.edit(Emb);
  https.get("https://api.roblox.com/users/" + usr, (res) => {
      
      let data = '';
      res.on('data', d => {
        data += d
      })
      res.on('end', () => {
        if (res.statusCode == 200) {
          toGet.push({method: method,username: JSON.parse(data).Username,value: usr,cid: message.channel.id,mid: message.id});
        } else {
          message.edit(Invalid);
        }
      });
  }).on('error', error => {
    console.error("RBLX API (UID) | " + error);
  });
}

function byUser(method,usr,message) {
    const Emb = new MessageEmbed()
          .setColor('#fff200')
          //.setTitle(request.headers.username + "'s Data")
          //.setTitle("Attempt")
          //.setAuthor('Roblox Error','')
          .setDescription("Attempting to "+method+" username "+ usr +"...")
          .setTimestamp()
          .setFooter('Developed by Stratiz');
    message.edit(Emb);
    https.get("https://api.roblox.com/users/get-by-username?username=" + usr, (res) => {
        let data = '';
        res.on('data', d => {
          data += d
        })
        res.on('end', () => {
          if (JSON.parse(data).Id != undefined) {
            toGet.push({method: method,value: JSON.parse(data).Id,username: JSON.parse(data).Username,cid: message.channel.id,mid: message.id});
          } else {
            message.edit(Invalid);
          }
        });
    }).on('error', error => {
      console.error("RBLX API (Username) | " + error);
    });
}

const TookTooLong = new MessageEmbed()
  .setColor('#eb4034')
  .setDescription("You took too long to respond!")


async function determineType(method,message,BotMsg,args) {
  if (isNaN(Number(args[1]))) {
    byUser(method,args[1],BotMsg);
  } else {
    const Emb = new MessageEmbed()
      .setColor('#ea00ff')
      //.setTitle(request.headers.username + "'s Data")
      .setTitle("Is this a UserID or a Username?")
      //.setAuthor('Roblox Error','')
      .setDescription("Please react with the number that matches the answer.")
      .addField(numbers[0] + ": Username","This is a players username in game.")
      .addField(numbers[1] + ": UserID","This is the players UserId connected with the account.")
      .setTimestamp()
      .setFooter('Developed by Stratiz');
    BotMsg.edit(Emb);
    try {
      await BotMsg.react(numbers[0]);
      await BotMsg.react(numbers[1]);
    } catch (error) {
      console.error('One of the emojis failed to react.');
    }
    const filter = (reaction, user) => {
      return numbers.includes(reaction.emoji.name) && user.id === message.author.id;
    };
    BotMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
      .then(collected => {
        const reaction = collected.first();
        const ind = numbers.findIndex(function(n){
           return n == reaction.emoji.name;
        })
        BotMsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
        if (ind == 0) {
          byUser(method,args[1],BotMsg);
        } else if (ind == 1) {
          byUID(method,args[1],BotMsg);
        } else {
          BotMsg.edit('Something went wrong');
        }//
      })
      .catch(collected => {
        BotMsg.edit(TookTooLong);
        BotMsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
      });
  }
}

app.get('/', async function(request, response) {
    if (request.headers.username != undefined) { 
      const channel = await client.channels.cache.get(request.headers.cid);
      channel.messages.fetch(request.headers.mid)
        .then(msg => {
          if (request.headers.rblxerror == undefined) {
            const Emb = new MessageEmbed()
                  .setColor('#00ff44')
                  .setTitle(request.headers.method + " successful. ")
                  .addField('Username',request.headers.username)
                  .addField('UserID',request.headers.value)
                  //.addField('Inline field title', 'Some value here', true)
                  //.setImage('https://www.roblox.com/Thumbs/Avatar.ashx?x=100&y=100&userId='+request.headers.uid)
                  .setTimestamp()
                  .setFooter('Developed by Stratiz');
            if (msg.author != undefined) {
              msg.edit(Emb);
            } else {
              channel.send(Emb);
            }
          } else {
            const Emb = new MessageEmbed()
                  .setColor('#eb4034')
                  .setTitle(request.headers.method + " failed. ")
                  .addField('Username',request.headers.username)
                  .addField('UserID',request.headers.value)
                  .addField('Rblx-Error',request.headers.rblxerror)
                  //.addField('Inline field title', 'Some value here', true)
                  //.setImage('https://www.roblox.com/Thumbs/Avatar.ashx?x=100&y=100&userId='+request.headers.uid)
                  .setTimestamp()
                  .setFooter('Developed by Stratiz');
                if (msg.author != undefined) {
                  msg.edit(Emb);
                } else {
                  channel.send(Emb);
                }
          }
      })
      .catch( err =>{
        console.log(err);       
      });
    }
    response.send(toGet[0]);
    toGet.shift();
});

let listener = app.listen(process.env.PORT, function() {
    //setInterval(() => { // Used to work sometime ago
    //    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    //}, 280000);
    console.log('Not that it matters but your app is listening on port ' + listener.address().port);
});

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
        var BotMsg = await message.channel.send("<@" + message.author.id + ">",Emb);
        determineType("Ban",message,BotMsg,args);

        app.use(express.static('public'));

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
