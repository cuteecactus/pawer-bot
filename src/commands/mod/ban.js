const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user.')
        .addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(false))
    ,
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const targetUser = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason');
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: '❌ You do not have permission to ban members.',
                ephemeral: true
            });
        }
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: '❌ I do not have permission to ban members.',
                ephemeral: true
            });
        }

        if (!targetUser) {
            return interaction.reply({ content: '❌ User not found.', ephemeral: true });
        }

        if (!targetUser.bannable) {
            return interaction.reply({
                content: '❌ I cannot ban this user (role hierarchy or owner).',
                ephemeral: true
            });
        }
        await interaction.guild.members.ban(targetUser, { reason: reason}).then(() => interaction.reply({ content: `${targetUser} has been banned.\n**Reason:** ${reason}` })).catch(error => console.log(error));
    }
};