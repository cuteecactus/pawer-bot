import { PermissionsBitField, EmbedBuilder } from "discord.js";
import { toggleAntiSpam } from "../as-toggle/logic.js";

export async function executeToggle(interaction) {
  if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
    return interaction.reply({ content: "❌ Missing Manage Server permission.", ephemeral: true });
  }

  const enabled = toggleAntiSpam(interaction.guild.id);

  const embed = new EmbedBuilder()
    .setTitle("🛡️ Anti-Spam")
    .setDescription(`Anti-spam is now **${enabled ? "ENABLED" : "DISABLED"}**`)
    .setColor(enabled ? "Green" : "Red");

  await interaction.reply({ embeds: [embed] });
}
