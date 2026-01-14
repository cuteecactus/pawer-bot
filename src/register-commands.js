const { REST, Routes } = require('discord.js');
const path = require('path');
const config = require('../config.json');
require('dotenv').config();

const getCommandFiles = require('./utils/get-command-files');

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = config.bot['client-id'];
const GUILD_ID = config['command-test-mode']['guild-id'];

const commands = [];

const commandFiles = getCommandFiles(path.join(__dirname, 'commands'));

for (const filePath of commandFiles) {
    const command = require(filePath);

    // 🔥 FILTER NON-SLASH COMMAND FILES
    if (!command.data || !command.execute) {
        console.warn(`[SKIP] ${filePath} is not a slash command`);
        continue;
    }

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
