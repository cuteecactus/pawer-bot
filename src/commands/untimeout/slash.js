import { SlashCommandBuilder } from "discord.js";
import { untimeoutLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("untimeout")
  .setDescription("Remove timeout from a user")
  .addUserOption(opt =>
    opt
      .setName("target")
      .setDescription("The user to remove timeout from")
      .setRequired(true)
  );

export async function execute(interaction) {
  const target = interaction.options.getMember("target");

  const result = await untimeoutLogic({
    executor: interaction.member,
    target
  });

  if (result.ok && result.embed) {
    await interaction.reply({ embeds: [result.embed] });
  } else {
    await interaction.reply(result.message);
  }
}
