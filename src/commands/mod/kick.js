const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to kick')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for the kick')
                .setRequired(false)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const reason =
            interaction.options.getString('reason') || 'No reason provided';

        // User permission check
        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({
                content: '❌ You do not have permission to kick members.',
                ephemeral: true
            });
        }

        // Bot permission check
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({
                content: '❌ I do not have permission to kick members.',
                ephemeral: true
            });
        }

        if (!target) {
            return interaction.reply({
                content: '❌ User not found in this server.',
                ephemeral: true
            });
        }

        // Owner check
        if (target.id === interaction.guild.ownerId) {
            return interaction.reply({
                content: '❌ You cannot kick the server owner.',
                ephemeral: true
            });
        }

        // Self check
        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: '❌ You cannot kick yourself.',
                ephemeral: true
            });
        }

        // Hierarchy check
        if (!target.kickable) {
            return interaction.reply({
                content: '❌ I cannot kick this user due to role hierarchy.',
                ephemeral: true
            });
        }

        await target.kick(reason);

        await interaction.reply({
            content: `👢 **${target.user.tag}** has been kicked.\n**Reason:** ${reason}`
        });
    }
};
