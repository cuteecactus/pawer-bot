import { SlashCommandBuilder } from "discord.js";
import { unmuteLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("unmute")
  .setDescription("Unmute a user using the configured mute role")
  .addUserOption(opt =>
    opt
      .setName("target")
      .setDescription("User to unmute")
      .setRequired(true)
  );

export async function execute(interaction) {
  const target = interaction.options.getMember("target");

  const result = await unmuteLogic({
    guild: interaction.guild,
    executor: interaction.member,
    target
  });

  if (result.ok) {
    await interaction.reply({ embeds: [result.embed] });
  } else {
    await interaction.reply({ content: result.message, ephemeral: true });
  }
}
