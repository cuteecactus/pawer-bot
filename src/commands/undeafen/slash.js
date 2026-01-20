import { SlashCommandBuilder } from "discord.js";
import { undeafenLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("undeafen")
  .setDescription("Remove server deafening from a user")
  .addUserOption(opt =>
    opt
      .setName("target")
      .setDescription("User to undeafen")
      .setRequired(true)
  );

export async function execute(interaction) {
  const target = interaction.options.getMember("target");

  const result = await undeafenLogic({
    executor: interaction.member,
    target
  });

  if (result.ok) {
    await interaction.reply({ embeds: [result.embed] });
  } else {
    await interaction.reply({ content: result.message, ephemeral: true });
  }
}
