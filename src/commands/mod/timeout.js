const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Times out a user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to timeout')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('duration')
                .setDescription('Timeout duration in minutes')
                .setRequired(true)
                .setMinValue(1)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for the timeout')
                .setRequired(false)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const minutes = interaction.options.getInteger('duration');
        const reason =
            interaction.options.getString('reason') || 'No reason provided';

        // Permission check (user)
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({
                content: '❌ You do not have permission to timeout members.',
                ephemeral: true
            });
        }

        // Permission check (bot)
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({
                content: '❌ I do not have permission to timeout members.',
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
                content: '❌ You cannot timeout the server owner.',
                ephemeral: true
            });
        }

        // Self check
        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: '❌ You cannot timeout yourself.',
                ephemeral: true
            });
        }

        // Bot check
        if (target.id === interaction.guild.members.me.id) {
            return interaction.reply({
                content: '❌ You cannot timeout me.',
                ephemeral: true
            });
        }

        // Already timed out?
        if (target.isCommunicationDisabled()) {
            return interaction.reply({
                content: '❌ This user is already timed out.',
                ephemeral: true
            });
        }

        // Discord limit: max 28 days
        const durationMs = minutes * 60 * 1000;
        const maxMs = 28 * 24 * 60 * 60 * 1000;

        if (durationMs > maxMs) {
            return interaction.reply({
                content: '❌ Timeout cannot exceed 28 days.',
                ephemeral: true
            });
        }

        await target.timeout(durationMs, reason);

        await interaction.reply({
            content: `⏳ **${target.user.tag}** has been timed out for **${minutes} minute(s)**.\n**Reason:** ${reason}`
        });
    }
};
