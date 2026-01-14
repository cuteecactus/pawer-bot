const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const config = require("../config.json")

const TOKEN = process.env.BOT_TOKEN;

const bot = new Client({
    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

// Command collection
bot.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.data.name, command);
}

// Chat Command collection
bot.chatCommands = new Collection();

// Load chat commands dynamically
const chatCommandFiles = fs.readdirSync('./src/chat-commands').filter(f => f.endsWith('.js'));
for (const file of chatCommandFiles) {
    const command = require(`./chat-commands/${file}`);
    bot.chatCommands.set(command.name, command);
}

// Interaction handler
bot.on('interactionCreate', async interaction => {

    if (!interaction.isChatInputCommand()) return;

    const command = bot.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error executing command.', ephemeral: true });
    }
});


// Ready event
bot.once('clientReady', () => {
    console.log(`Logged in as ${bot.user.tag}`);
});

bot.on('messageCreate', async message => {
    if (message.author.bot) return; // ignore bots
    if (!message.content.startsWith(config.bot.prefix)) return;

    const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = bot.chatCommands.get(commandName);
    if (!command) return;
    try {
        await command.execute(message, args, bot);
    } catch (error) {
        console.error(error);
        message.reply({ content: 'There was an error executing that command.', ephemeral: true });
    }
});




bot.login(TOKEN);
