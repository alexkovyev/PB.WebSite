const Discord = require('discord.js');

const bot = new Discord.Client();
const botConfig = require('./botconfig');
const {
  token,
  prefix
} = botConfig;

var channelsOperator = {};
var channelsAdmin = {};

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);

  bot.channels.cache.forEach((channel, index) => {
    if (channel.type === 'text') {
      const name = channel.name;

      if (name.indexOf('operator') === 0) {
        channelsOperator[name] = channel;
      }

      if(name.indexOf('admin') === 0) {
        channelsAdmin[name] = channel;
      }
    };
  })
  
});

bot.on('message', msg => {
  if (msg.content.toLocaleLowerCase() === 'ping') {
    msg.reply('Pong!');
  }

  if (msg.content.toLocaleLowerCase() === 'beep') {
    msg.reply('Boop!');
  }
  
  if (msg.content.toLocaleLowerCase().indexOf('привет') >= 0 && 
      msg.author.id !== bot.user.id) {
        var replyMsg = 'И тебе привет, мой дорогой друг!';
        if (msg.author.id === '589497992566800384') {
          replyMsg = 'Привет, БОСС!';
        }
        if (msg.author.id === '518490047217926175') {
          replyMsg = 'Привет, СОЗДАТЕЛЬ!';
        }
        msg.reply(replyMsg);
  }
});

bot.login(token);

function sendDocs(content, fileToSend, pointKey, is_all_channel_msg=false) {
  var channelKey = 'admin_' + pointKey;
  if (!pointKey || !fileToSend) return;

  channelsAdmin[channelKey].send(content, {files: [fileToSend]});

  if (is_all_channel_msg) {
    channelKey = 'operator_'  + pointKey;
    
    channelsOperator[channelKey].send(content, {files: [fileToSend]});
  }
} 

module.exports = {
  sendDocs,
}