const { REST, Routes } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
require('dotenv').config()


const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = config.bot['client-id'];
const GUILD_ID = config['command-test-mode']['guild-id']; // Use dev server guild ID

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`Registering ${commands.length} guild command(s)...`);
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('Guild commands registered successfully!');
    } catch (error) {
        console.error(error);
    }
})();
