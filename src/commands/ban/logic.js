import { EmbedBuilder, PermissionsBitField } from "discord.js";

export async function banLogic({ guild, executor, target, reason }) {
  // Permission check
  if (!executor.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    return { ok: false, message: "❌ You need **Ban Members** permission to use this command." };
  }

  // Can't ban self or bot owner
  if (target.id === executor.id) {
    return { ok: false, message: "❌ You cannot ban yourself." };
  }
  if (!target.bannable) {
    return { ok: false, message: "❌ I cannot ban this user (role hierarchy or bot protection)." };
  }

  try {
    await target.ban({ reason: reason || "No reason provided" });

    const embed = new EmbedBuilder()
      .setTitle("🔨 User Banned")
      .setDescription(`**${target.user.tag}** was banned by **${executor.user.tag}**`)
      .addFields({ name: "Reason", value: reason || "No reason provided" })
      .setColor("Red")
      .setTimestamp();

    return { ok: true, embed };
  } catch (err) {
    return { ok: false, message: "❌ Failed to ban user: " + err.message };
  }
}
