const { Message, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'ban',
    description: 'Bans a user from this server',

    /**
     * @param {Message} message
     */
    execute: async (message, args, client) => {
        if (!args[0]) {
            return message.reply('❌ Please mention a user or provide an ID.');
        }

        const target =
            message.mentions.members.first() ||
            await message.guild.members.fetch(args[0]).catch(() => null);

        if (!target) {
            return message.reply('❌ User not found in this server.');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        // User permission check
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply('❌ You do not have permission to ban members.');
        }

        // Bot permission check
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply('❌ I do not have permission to ban members.');
        }

        // Owner check
        if (target.id === message.guild.ownerId) {
            return message.reply('❌ You cannot ban the server owner.');
        }

        // Self check
        if (target.id === message.author.id) {
            return message.reply('❌ You cannot ban yourself.');
        }

        // Hierarchy check
        if (!target.bannable) {
            return message.reply('❌ I cannot ban this user due to role hierarchy.');
        }

        await target.ban({ reason });

        message.reply(
            `🔨 **${target.user.tag}** has been banned.\n**Reason:** ${reason}`
        );
    }
};
