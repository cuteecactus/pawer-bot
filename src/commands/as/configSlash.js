import { EmbedBuilder } from "discord.js";
import { getDashboardRedirect } from "../as-config/logic.js";

export async function executeConfig(interaction) {
  const embed = new EmbedBuilder()
    .setTitle("🛡️ Anti-Spam Configuration")
    .setDescription(
      "Anti-spam settings are managed from the dashboard.\n\n" +
      `🔗 ${getDashboardRedirect()}`
    )
    .setColor("Blue");

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
