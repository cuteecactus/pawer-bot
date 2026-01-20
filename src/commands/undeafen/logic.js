import { EmbedBuilder, PermissionsBitField } from "discord.js";

export async function undeafenLogic({ executor, target }) {
  // Permission check
  if (!executor.permissions.has(PermissionsBitField.Flags.DeafenMembers)) {
    return {
      ok: false,
      message: "❌ You need **Deafen Members** permission to undeafen users."
    };
  }

  // Must be in voice
  if (!target.voice.channel) {
    return {
      ok: false,
      message: "❌ User is not in a voice channel."
    };
  }

  // Not deafened
  if (!target.voice.serverDeaf) {
    return {
      ok: false,
      message: "⚠️ This user is not deafened."
    };
  }

  try {
    await target.voice.setDeaf(false, `Undeafened by ${executor.user.tag}`);

    const embed = new EmbedBuilder()
      .setTitle("🔊 User Undeafened")
      .setDescription(`**${target.user.tag}** has been undeafened`)
      .addFields(
        { name: "Moderator", value: executor.user.tag, inline: true },
        { name: "Channel", value: target.voice.channel.name, inline: true }
      )
      .setColor("Green")
      .setTimestamp();

    return { ok: true, embed };
  } catch (err) {
    return {
      ok: false,
      message: "❌ Failed to undeafen user: " + err.message
    };
  }
}
