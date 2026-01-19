import { SlashCommandBuilder } from "discord.js";
import { banLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Ban a user from the server")
  .addUserOption(opt =>
    opt
      .setName("target")
      .setDescription("The user to ban")
      .setRequired(true)
  )
  .addStringOption(opt =>
    opt
      .setName("reason")
      .setDescription("Reason for the ban")
      .setRequired(false)
  );

export async function execute(interaction) {
  const target = interaction.options.getMember("target");
  const reason = interaction.options.getString("reason");

  const result = await banLogic({
    guild: interaction.guild,
    executor: interaction.member,
    target,
    reason
  });

  if (result.ok && result.embed) {
    await interaction.reply({ embeds: [result.embed] });
  } else {
    await interaction.reply(result.message);
  }
}
