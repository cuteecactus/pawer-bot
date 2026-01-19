import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { getGuild } from "../services/guildService.js";

export const commands = new Map();

export async function loadCommands() {
  const commandsPath = path.resolve("src/commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(f => f.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const fileUrl = pathToFileURL(filePath).href;

    const mod = await import(fileUrl);
    if (!mod.name || !mod.execute) continue;

    commands.set(mod.name, mod);
    console.log(`Loaded command: ${mod.name}`);
  }
}

export function handleCommand(message) {
  if (message.author.bot || !message.guild) return;

  const guild = getGuild(message.guild.id);
  const prefix = guild.settings?.prefix || "!";

  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);

  const cmd = args.shift().toLowerCase();

  const command = commands.get(cmd);
  if (!command) return;

  try {
    command.execute(message, args);
  } catch (err) {
    console.error("Command error:", err);
    message.reply("Something broke. Try again.");
  }
}
