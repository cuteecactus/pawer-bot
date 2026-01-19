import { SlashCommandBuilder } from "discord.js";
import { userInfoLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("user")
  .setDescription("Get detailed info about a user")
  .addUserOption(opt =>
    opt
      .setName("target")
      .setDescription("The user to get info for")
      .setRequired(false)
  );

export async function execute(interaction) {
  const member = interaction.options.getMember("target") || interaction.member;
  const embed = await userInfoLogic({ member });
  await interaction.reply({ embeds: [embed] });
}
