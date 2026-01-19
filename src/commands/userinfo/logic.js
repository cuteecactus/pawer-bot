import { EmbedBuilder } from "discord.js";

export async function userInfoLogic({ member }) {
  const user = member.user;

  // Roles excluding @everyone
  const roles = member.roles.cache
    .filter(r => r.id !== member.guild.id)
    .sort((a, b) => b.position - a.position)
    .map(r => r.toString());

  const embed = new EmbedBuilder()
    .setTitle(`👤 User Info — ${user.tag}`)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: "🆔 User ID", value: user.id, inline: true },
      { name: "💻 Bot", value: user.bot ? "Yes 🤖" : "No 👤", inline: true },
      { name: "🏷️ Highest Role", value: member.roles.highest.name, inline: true },
      { name: "📅 Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true },
      { name: "📅 Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
      { name: `🛡️ Roles (${roles.length})`, value: roles.length > 0 ? roles.join(", ") : "None", inline: false }
    )
    .setColor("Green");

  return embed;
}
