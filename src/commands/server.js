const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Displays information about the server.'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const targetGuild = interaction.guild;
        
        const createTime = targetGuild.createdTimestamp;
        const time = Math.floor(createTime / 1000);

        const onlineMembers = targetGuild.members.cache.filter(member => member.presence && member.presence.status !== 'offline').size;
        const textChannels = targetGuild.channels.cache.filter(channel => channel.type == ChannelType.GuildText).size;
        const vcChannels = targetGuild.channels.cache.filter(channel => channel.type == ChannelType.GuildVoice).size;
        const embed = new EmbedBuilder()
            // .setTitle(`${targetGuild.name}`)
            .setAuthor({ name: targetGuild.name, iconURL: targetGuild.iconURL({ size: 1024, extension: 'png' }) })
            .setThumbnail(targetGuild.iconURL({ size: 1024, extension: 'png' }))
            .addFields(
                { name: ':id: Server ID:', value: `${targetGuild.id}`, inline: true },
                { name: ':calendar: Created On:', value: `<t:${time}:R>`, inline: true },
                { name: ':crown: Owned by:', value: `${targetGuild.owner}`, inline: true },
                { name: `:busts_in_silhouette: Members (${targetGuild.memberCount})`, value: `${onlineMembers} online\n${targetGuild.premiumSubscriptionCount} boosts`, inline: true },
                { name: `:speech_balloon: Channels (${targetGuild.channels.cache.size})`, value: `${textChannels} text | ${vcChannels} voice`, inline: true },
                { name: `:closed_lock_with_key:  Roles (${targetGuild.roles.cache.size})`, value: `To see a list with all roles use **/roles**`, inline: true },
            ).setColor("DarkVividPink")

        await interaction.reply({ content: "", embeds: [embed]});
    }
};