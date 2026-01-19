import { EmbedBuilder } from "discord.js";

export async function roleInfoLogic({ role }) {
  const embed = new EmbedBuilder()
    .setTitle(`🏷️ Role Info — ${role.name}`)
    .setColor(role.color || "Grey")
    .addFields(
      { name: "🆔 Role ID", value: role.id, inline: true },
      { name: "🎨 Color", value: role.hexColor.toUpperCase(), inline: true },
      { name: "👥 Members", value: `${role.members.size}`, inline: true },
      { name: "🔼 Position", value: `${role.position}`, inline: true },
      { name: "🛡️ Hoisted", value: role.hoist ? "Yes" : "No", inline: true },
      { name: "🔧 Managed", value: role.managed ? "Yes" : "No", inline: true },
      { name: "📢 Mentionable", value: role.mentionable ? "Yes" : "No", inline: true }
    );

  return embed;
}
