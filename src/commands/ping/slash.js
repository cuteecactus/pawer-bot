import { SlashCommandBuilder } from "discord.js";
import { pingLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Check bot latency");

export async function execute(interaction) {
  const result = await pingLogic();
  await interaction.reply(result.message);
}
