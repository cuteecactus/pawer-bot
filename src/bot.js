const { Client, GatewayIntentBits } = require ("discord.js")
require('dotenv').config()

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

bot.on('clientReady', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.login(process.env.BOT_TOKEN);