import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { getGuild } from "../services/guildService.js";

const messageCommands = new Map();

export async function loadMessageCommands() {
  const base = path.resolve("src/commands");

  for (const dir of fs.readdirSync(base)) {
    const file = path.join(base, dir, "message.js");
    if (!fs.existsSync(file)) continue;

    const mod = await import(pathToFileURL(file).href);
    messageCommands.set(mod.name, mod);
    console.log(`Loaded message command: ${mod.name}`);
  }
}

export async function handleMessage(message) {
  if (!message.guild || message.author.bot) return;

  const guild = getGuild(message.guild.id);
  const prefix = guild.settings?.prefix || "!";

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  const command = messageCommands.get(cmd);
  if (!command) return;

  await command.execute(message, args);
}
