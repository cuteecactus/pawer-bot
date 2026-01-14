const { Message, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'timeout',
    description: 'Times out a user',

    /**
     * @param {Message} message
     */
    execute: async (message, args, client) => {
        if (args.length < 2) {
            return message.reply('❌ Usage: `!timeout @user <minutes> [reason]`');
        }

        const target =
            message.mentions.members.first() ||
            await message.guild.members.fetch(args[0]).catch(() => null);

        if (!target) {
            return message.reply('❌ User not found in this server.');
        }

        const minutes = parseInt(args[1]);
        if (isNaN(minutes) || minutes < 1) {
            return message.reply('❌ Duration must be a valid number (minutes).');
        }

        const reason = args.slice(2).join(' ') || 'No reason provided';

        // User permission check
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('❌ You do not have permission to timeout members.');
        }

        // Bot permission check
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('❌ I do not have permission to timeout members.');
        }

        // Owner check
        if (target.id === message.guild.ownerId) {
            return message.reply('❌ You cannot timeout the server owner.');
        }

        // Self check
        if (target.id === message.author.id) {
            return message.reply('❌ You cannot timeout yourself.');
        }

        // Bot check
        if (target.id === message.guild.members.me.id) {
            return message.reply('❌ You cannot timeout me.');
        }

        // Already timed out?
        if (target.isCommunicationDisabled()) {
            return message.reply('❌ This user is already timed out.');
        }

        // Max 28 days
        const durationMs = minutes * 60 * 1000;
        const maxMs = 28 * 24 * 60 * 60 * 1000;

        if (durationMs > maxMs) {
            return message.reply('❌ Timeout cannot exceed 28 days.');
        }

        await target.timeout(durationMs, reason);

        message.reply(
            `⏳ **${target.user.tag}** has been timed out for **${minutes} minute(s)**.\n**Reason:** ${reason}`
        );
    }
};
