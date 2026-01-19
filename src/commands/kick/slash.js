import { SlashCommandBuilder } from "discord.js";
import { kickLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kick a user from the server")
  .addUserOption(opt =>
    opt
      .setName("target")
      .setDescription("The user to kick")
      .setRequired(true)
  )
  .addStringOption(opt =>
    opt
      .setName("reason")
      .setDescription("Reason for the kick")
      .setRequired(false)
  );

export async function execute(interaction) {
  const target = interaction.options.getMember("target");
  const reason = interaction.options.getString("reason");

  const result = await kickLogic({
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
