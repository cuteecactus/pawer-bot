import { EmbedBuilder, PermissionsBitField, ChannelType } from "discord.js";

export async function moveLogic({ executor, target, channel }) {
  // Permission check
  if (!executor.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
    return {
      ok: false,
      message: "❌ You need **Move Members** permission to move users."
    };
  }

  // Must be in voice
  if (!target.voice.channel) {
    return {
      ok: false,
      message: "❌ User is not in a voice channel."
    };
  }

  // Target channel must be voice
  if (!channel || channel.type !== ChannelType.GuildVoice) {
    return {
      ok: false,
      message: "❌ Target channel must be a voice channel."
    };
  }

  // Prevent self move
  if (executor.id === target.id) {
    return {
      ok: false,
      message: "❌ You cannot move yourself."
    };
  }

  // Already in that channel
  if (target.voice.channelId === channel.id) {
    return {
      ok: false,
      message: "⚠️ User is already in that channel."
    };
  }

  try {
    await target.voice.setChannel(
      channel,
      `Moved by ${executor.user.tag}`
    );

    const embed = new EmbedBuilder()
      .setTitle("🔀 User Moved")
      .setDescription(`**${target.user.tag}** was moved`)
      .addFields(
        { name: "Moderator", value: executor.user.tag, inline: true },
        { name: "From", value: target.voice.channel.name, inline: true },
        { name: "To", value: channel.name, inline: true }
      )
      .setColor("Blue")
      .setTimestamp();

    return { ok: true, embed };
  } catch (err) {
    return {
      ok: false,
      message: "❌ Failed to move user: " + err.message
    };
  }
}
