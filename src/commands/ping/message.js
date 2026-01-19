import { pingLogic } from "./logic.js";

export const name = "ping";

export async function execute(message, args) {
  const result = await pingLogic();
  await message.reply(result.message);
}
