const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Displays information about the user.')
        .addUserOption(option => option.setName('user').setDescription('The user to get information about').setRequired(false))
        ,
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const targetGuild = interaction.guild;
        
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

        await interaction.reply({ content: "", embeds: [embed]});
    }
};