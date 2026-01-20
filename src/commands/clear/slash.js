import { SlashCommandBuilder } from "discord.js";
import { clearLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("Clear a number of messages from this channel")
  .addIntegerOption(opt =>
    opt
      .setName("amount")
      .setDescription("Number of messages to delete (1–100)")
      .setRequired(true)
  );

export async function execute(interaction) {
  const amount = interaction.options.getInteger("amount");

  const result = await clearLogic({
    executor: interaction.member,
    channel: interaction.channel,
    amount
  });

  if (result.ok) {
    await interaction.reply({ embeds: [result.embed], ephemeral: true });
  } else {
    await interaction.reply({ content: result.message, ephemeral: true });
  }
}
