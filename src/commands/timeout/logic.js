import { EmbedBuilder, PermissionsBitField } from "discord.js";

export async function timeoutLogic({ guild, executor, target, duration, reason }) {
  // Permission check
  if (!executor.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
    return { ok: false, message: "❌ You need **Moderate Members** permission to use this command." };
  }

  // Can't timeout self
  if (target.id === executor.id) {
    return { ok: false, message: "❌ You cannot timeout yourself." };
  }

  // Convert duration to ms
  const durationMs = duration ? msToMs(duration) : 0;

  try {
    await target.timeout(durationMs || null, reason || "No reason provided");

    const embed = new EmbedBuilder()
      .setTitle("⏱️ User Timed Out")
      .setDescription(`**${target.user.tag}** was timed out by **${executor.user.tag}**`)
      .addFields(
        { name: "Duration", value: duration ? duration : "Indefinite", inline: true },
        { name: "Reason", value: reason || "No reason provided", inline: true }
      )
      .setColor("DarkOrange")
      .setTimestamp();

    return { ok: true, embed };
  } catch (err) {
    return { ok: false, message: "❌ Failed to timeout user: " + err.message };
  }
}

// Helper: simple duration parser (e.g., 10m, 2h)
function msToMs(str) {
  if (!str) return 0;
  const match = str.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return 0;
  const n = parseInt(match[1]);
  const unit = match[2];
  switch (unit) {
    case "s": return n * 1000;
    case "m": return n * 60 * 1000;
    case "h": return n * 60 * 60 * 1000;
    case "d": return n * 24 * 60 * 60 * 1000;
    default: return 0;
  }
}
