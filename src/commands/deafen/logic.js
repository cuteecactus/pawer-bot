import { EmbedBuilder, PermissionsBitField } from "discord.js";

export async function deafenLogic({ executor, target }) {
  // Permission check
  if (!executor.permissions.has(PermissionsBitField.Flags.DeafenMembers)) {
    return {
      ok: false,
      message: "❌ You need **Deafen Members** permission to do this."
    };
  }

  // Must be in a voice channel
  if (!target.voice.channel) {
    return {
      ok: false,
      message: "❌ User must be in a voice channel."
    };
  }

  // Already deafened
  if (target.voice.serverDeaf) {
    return {
      ok: false,
      message: "⚠️ This user is already deafened."
    };
  }

  try {
    await target.voice.setDeaf(true, `Deafened by ${executor.user.tag}`);

    const embed = new EmbedBuilder()
      .setTitle("🔇 User Deafened")
      .setDescription(`**${target.user.tag}** has been deafened`)
      .addFields(
        { name: "Moderator", value: executor.user.tag, inline: true },
        { name: "Channel", value: target.voice.channel.name, inline: true }
      )
      .setColor("Red")
      .setTimestamp();

    return { ok: true, embed };
  } catch (err) {
    return {
      ok: false,
      message: "❌ Failed to deafen user: " + err.message
    };
  }
}
