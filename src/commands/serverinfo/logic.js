import { EmbedBuilder } from "discord.js";

export async function serverInfoLogic({ guild }) {
  // Count humans vs bots
  const humans = guild.members.cache.filter(m => !m.user.bot).size;
  const bots = guild.members.cache.filter(m => m.user.bot).size;

  // Count channel types
  const textChannels = guild.channels.cache.filter(c => c.type === 0).size; // GUILD_TEXT
  const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size; // GUILD_VOICE

  const embed = new EmbedBuilder()
    .setTitle(`🌐 ${guild.name} — Server Info`)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .addFields(
      { name: "🆔 Server ID", value: guild.id, inline: true },
      { name: "👑 Owner", value: `<@${guild.ownerId}>`, inline: true },
      { name: `👥 Members (${guild.memberCount}) `, value: `👤 Humans: ${humans}\n🤖 Bots: ${bots}`, inline: true },
      { name: "💎 Boost Tier", value: `Tier ${guild.premiumTier}`, inline: true },
      { name: "🚀 Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true },
      { name: `📂 Channels (${guild.channels.cache.size})`, value: `💬 Text: ${textChannels}\n🔊 Voice: ${voiceChannels}`, inline: true },
      { name: `🎨 Roles (${guild.roles.cache.size})`, value: `Use \`/roles\``, inline: false },
      { name: "🗓️ Created At", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>` }
    )
    .setColor("Blue");

  return embed;
}
