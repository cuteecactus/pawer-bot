module.exports = {
    name: 'ping', // must match file name
    description: 'Replies with Pong and latency',
    /**
     * @param {Message} message
     */
    execute: async (message, args, client) => {
        const sent = await message.channel.send('Pinging...');
        const latency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = client.ws.ping;
        sent.edit(`🏓 Pong!\nMessage latency: ${latency}ms\nAPI latency: ${apiLatency}ms`);
    }
};
