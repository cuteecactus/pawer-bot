import { SlashCommandBuilder } from "discord.js";
import { deafenLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("deafen")
  .setDescription("Server-deafen a user in voice")
  .addUserOption(opt =>
    opt
      .setName("target")
      .setDescription("User to deafen")
      .setRequired(true)
  );

export async function execute(interaction) {
  const target = interaction.options.getMember("target");

  const result = await deafenLogic({
    executor: interaction.member,
    target
  });

  if (result.ok) {
    await interaction.reply({ embeds: [result.embed] });
  } else {
    await interaction.reply({ content: result.message, ephemeral: true });
  }
}
