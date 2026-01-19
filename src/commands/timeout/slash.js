import { SlashCommandBuilder } from "discord.js";
import { timeoutLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("timeout")
  .setDescription("Timeout a user for a certain duration")
  .addUserOption(opt =>
    opt
      .setName("target")
      .setDescription("The user to timeout")
      .setRequired(true)
  )
  .addStringOption(opt =>
    opt
      .setName("duration")
      .setDescription("Duration (e.g., 10m, 2h, 1d)")
      .setRequired(true)
  )
  .addStringOption(opt =>
    opt
      .setName("reason")
      .setDescription("Reason for the timeout")
      .setRequired(false)
  );

export async function execute(interaction) {
  const target = interaction.options.getMember("target");
  const duration = interaction.options.getString("duration");
  const reason = interaction.options.getString("reason");

  const result = await timeoutLogic({
    guild: interaction.guild,
    executor: interaction.member,
    target,
    duration,
    reason
  });

  if (result.ok && result.embed) {
    await interaction.reply({ embeds: [result.embed] });
  } else {
    await interaction.reply(result.message);
  }
}
