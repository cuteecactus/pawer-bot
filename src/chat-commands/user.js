const { Message, EmbedBuilder} = require("discord.js");

module.exports = {
    name: 'user', // must match file name
    description: 'Displays information about the user.',
    /**
     * @param {Message} message
     */
    execute: async (message, args, client) => {
        // console.log (args)
        const targetUser = message.mentions.users.first() || message.author;
        const targetGuild = message.guild;
        
        const userCreatTimestamps = targetUser.createdTimestamp;
        const userCreatTime = Math.floor(userCreatTimestamps / 1000);
        
        const serverTimeStamps = targetGuild.members.cache.get(targetUser.id).joinedTimestamp;
        const serverTime = Math.floor(serverTimeStamps / 1000);
        
        const embed = new EmbedBuilder()
            .setThumbnail(targetUser.avatarURL({ size: 1024, extension: 'png' }))
            .addFields(
                { name: 'User ID:', value: `${targetUser.id}`, inline: true },
                { name: 'Joined Discord:', value: `<t:${userCreatTime}:R>`, inline: true },
                { name: 'Joined Server:', value: `<t:${serverTime}:R>`, inline: true },
            )
            .setColor("DarkVividPink")
            .setFooter ({ text: targetUser.tag, iconURL: targetUser.avatarURL({ size: 1024, extension: 'png' }) });    

        await message.reply({ content: "", embeds: [embed]});
    }
};
