import config from "../../../config.json" with { type: "json" };
// import { dashboardUrl} from "../../../config.json"

export function getDashboardRedirect() {
  return config.dashboardUrl;
}
