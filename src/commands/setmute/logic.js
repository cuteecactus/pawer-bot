import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { updateGuild } from "../../services/guildService.js";

export async function setMuteLogic({ guild, executor, role }) {
  if (!executor.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return {
      ok: false,
      message: "❌ You must have **Administrator** permission to set the mute role."
    };
  }

  // Save mute role
  updateGuild(guild.id, { muteRoleId: role.id });

  const embed = new EmbedBuilder()
    .setTitle("🔇 Mute Role Configured")
    .setDescription(`Mute role has been set to ${role}`)
    .addFields(
      { name: "Role Name", value: role.name, inline: true },
      { name: "Role ID", value: role.id, inline: true }
    )
    .setColor("DarkGrey")
    .setTimestamp();

  return { ok: true, embed };
}
