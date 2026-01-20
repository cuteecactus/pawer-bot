import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { getGuild } from "../../services/guildService.js";

export async function muteLogic({ guild, executor, target, reason }) {
  // Permission check
  if (!executor.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
    return {
      ok: false,
      message: "❌ You need **Moderate Members** permission to mute members."
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

  // Can't mute self
  if (target.id === executor.id) {
    return { ok: false, message: "❌ You cannot mute yourself." };
  }

  // Hierarchy checks
  if (target.roles.highest.position >= executor.roles.highest.position) {
    return {
      ok: false,
      message: "❌ You cannot mute a member with equal or higher role."
    };
  }

  if (!guild.members.me.roles.highest.position > muteRole.position) {
    return {
      ok: false,
      message: "❌ My role must be higher than the mute role."
    };
  }

  if (target.roles.cache.has(muteRole.id)) {
    return { ok: false, message: "⚠️ This user is already muted." };
  }

  try {
    await target.roles.add(muteRole, reason || "No reason provided");

    const embed = new EmbedBuilder()
      .setTitle("🔇 User Muted")
      .setDescription(`**${target.user.tag}** was muted`)
      .addFields(
        { name: "Moderator", value: executor.user.tag, inline: true },
        { name: "Reason", value: reason || "No reason provided", inline: true }
      )
      .setColor("DarkRed")
      .setTimestamp();

    return { ok: true, embed };
  } catch (err) {
    return {
      ok: false,
      message: "❌ Failed to mute user: " + err.message
    };
  }
}
