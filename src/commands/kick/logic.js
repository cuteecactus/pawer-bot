import { EmbedBuilder, PermissionsBitField } from "discord.js";

export async function kickLogic({ guild, executor, target, reason }) {
  // Permission check
  if (!executor.permissions.has(PermissionsBitField.Flags.KickMembers)) {
    return { ok: false, message: "❌ You need **Kick Members** permission to use this command." };
  }

  // Can't kick self
  if (target.id === executor.id) {
    return { ok: false, message: "❌ You cannot kick yourself." };
  }

  if (!target.kickable) {
    return { ok: false, message: "❌ I cannot kick this user (role hierarchy or bot protection)." };
  }

  try {
    await target.kick(reason || "No reason provided");

    const embed = new EmbedBuilder()
      .setTitle("👢 User Kicked")
      .setDescription(`**${target.user.tag}** was kicked by **${executor.user.tag}**`)
      .addFields({ name: "Reason", value: reason || "No reason provided" })
      .setColor("Orange")
      .setTimestamp();

    return { ok: true, embed };
  } catch (err) {
    return { ok: false, message: "❌ Failed to kick user: " + err.message };
  }
}
