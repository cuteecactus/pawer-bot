export const name = "role";

export async function execute(message, args) {
  return message.reply(
    "⚠️ The role command only works as a slash command. Please use `/role <role>`."
  );
}