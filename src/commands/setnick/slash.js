import { SlashCommandBuilder } from "discord.js";
import { setNickLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("setnick")
  .setDescription("Set or reset a user's nickname")
  .addUserOption(opt =>
    opt
      .setName("target")
      .setDescription("User whose nickname to change")
      .setRequired(true)
  )
  .addStringOption(opt =>
    opt
      .setName("nickname")
      .setDescription("New nickname (leave empty to reset)")
      .setRequired(false)
  );

export async function execute(interaction) {
  const target = interaction.options.getMember("target");
  const nickname = interaction.options.getString("nickname");

  const result = await setNickLogic({
    guild: interaction.guild,
    executor: interaction.member,
    target,
    nickname
  });

  if (result.ok) {
    await interaction.reply({ embeds: [result.embed] });
  } else {
    await interaction.reply({ content: result.message, ephemeral: true });
  }
}
