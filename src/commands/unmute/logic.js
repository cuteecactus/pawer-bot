import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { getGuild } from "../../services/guildService.js";

export async function unmuteLogic({ guild, executor, target }) {
  // Permission check
  if (!executor.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
    return {
      ok: false,
      message: "❌ You need **Moderate Members** permission to unmute members."
    };
  }

  const guildData = getGuild(guild.id);
  const muteRoleId = guildData.settings?.muteRoleId;

  if (!muteRoleId) {
    return {
      ok: false,
      message: "❌ Mute role is not configured. Use `/setmute` first."
    };
  }

  const muteRole = guild.roles.cache.get(muteRoleId);
  if (!muteRole) {
    return {
      ok: false,
      message: "❌ Configured mute role no longer exists. Run `/setmute` again."
    };
  }

  // Can't unmute self
  if (target.id === executor.id) {
    return { ok: false, message: "❌ You cannot unmute yourself." };
  }

  if (!target.roles.cache.has(muteRole.id)) {
    return { ok: false, message: "⚠️ This user is not muted." };
  }

  try {
    await target.roles.remove(muteRole, `Unmuted by ${executor.user.tag}`);

    const embed = new EmbedBuilder()
      .setTitle("🔊 User Unmuted")
      .setDescription(`**${target.user.tag}** was unmuted`)
      .addFields({ name: "Moderator", value: executor.user.tag, inline: true })
      .setColor("Green")
      .setTimestamp();

    return { ok: true, embed };
  } catch (err) {
    return { ok: false, message: "❌ Failed to unmute user: " + err.message };
  }
}
