import { EmbedBuilder, PermissionsBitField } from "discord.js";

export async function untimeoutLogic({ executor, target }) {
  // Permission check
  if (!executor.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
    return { ok: false, message: "❌ You need **Moderate Members** permission to use this command." };
  }

  // Can't untimeout self
  if (target.id === executor.id) {
    return { ok: false, message: "❌ You cannot untimeout yourself." };
  }

  try {
    await target.timeout(null); // remove timeout

    const embed = new EmbedBuilder()
      .setTitle("✅ Timeout Removed")
      .setDescription(`**${target.user.tag}** was untimeouted by **${executor.user.tag}**`)
      .setColor("Green")
      .setTimestamp();

    return { ok: true, embed };
  } catch (err) {
    return { ok: false, message: "❌ Failed to remove timeout: " + err.message };
  }
}
