
import { getDashboardRedirect } from "./logic.js";
export const name = "antispam";

export async function execute(message, args) {
  const dashboardUrl = getDashboardRedirect();

  message.reply(
    `🛡️ Anti-spam settings are managed from the dashboard.\n🔗 Dashboard: ${dashboardUrl}`
  );
}
