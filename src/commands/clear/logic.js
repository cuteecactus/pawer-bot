import { EmbedBuilder, PermissionsBitField } from "discord.js";

export async function clearLogic({ executor, channel, amount }) {
  if (!executor.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    return {
      ok: false,
      message: "❌ You need **Manage Messages** permission."
    };
  }

  if (amount < 1 || amount > 100) {
    return {
      ok: false,
      message: "❌ Amount must be between 1 and 100."
    };
  }

  if (
    !channel
      .permissionsFor(channel.guild.members.me)
      .has(PermissionsBitField.Flags.ManageMessages)
  ) {
    return {
      ok: false,
      message: "❌ I don't have permission to manage messages in this channel."
    };
  }

  try {
    const deleted = await channel.bulkDelete(amount, true);

    const embed = new EmbedBuilder()
      .setTitle("🧹 Messages Cleared")
      .setDescription(`Deleted **${deleted.size}** messages`)
      .addFields({ name: "Moderator", value: executor.user.tag, inline: true })
      .setColor("Orange")
      .setTimestamp();

    return { ok: true, embed };
  } catch (err) {
    return {
      ok: false,
      message: "❌ Failed to clear messages: " + err.message
    };
  }
}
