import { SlashCommandBuilder } from "discord.js";
import { prefixLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("prefix")
  .setDescription("View or change the server prefix")
  .addStringOption(opt =>
    opt
      .setName("value")
      .setDescription("New prefix")
      .setRequired(false)
  );

export async function execute(interaction) {
  const value = interaction.options.getString("value");
  const args = value ? [value] : [];

  const result = await prefixLogic({
    guildId: interaction.guild.id,
    member: interaction.member,
    args
  });

  await interaction.reply(result.message);
}
