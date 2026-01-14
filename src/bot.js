const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const TOKEN = process.env.BOT_TOKEN;

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

// Command collection
bot.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.data.name, command);
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

bot.login(TOKEN);
