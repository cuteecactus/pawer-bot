


/*
Structure:
buckets = Map<
  guildId,
  Map<
    userId,
    {
      timestamps: number[],
      violations: number,
      lastViolation: number
    }
  >
>
*/
import { getGuild } from "./guildService.js";
// import { DEFAULT_ANTISPAM } from "./defaultConfig.js"; // optional separate file

const buckets = new Map();


export const DEFAULT_ANTISPAM = {
  enabled: true,
  limit: 5,                // messages per window
  window: 5000,             // 5 seconds
  maxViolations: 3,         // before timeout
  timeoutSeconds: 60,       // duration of timeout

  warnBeforeTimeout: false, // dashboard only toggle
  warnCount: 2,             // stub for future warn system

  whitelist: {
    roles: [],
    users: [],
    channels: []
  }
};
/**
 * Check if a message is whitelisted
 */
function isWhitelisted(message, config) {
  if (config.whitelist.users.includes(message.author.id)) return true;
  if (config.whitelist.channels.includes(message.channel.id)) return true;
  return message.member.roles.cache.some(r =>
    config.whitelist.roles.includes(r.id)
  );
}

/**
 * Returns {spam: boolean, violations: number, config: object}
 */
export function checkSpam(message) {
  const { guild, author } = message;
  const now = Date.now();

  const guildData = getGuild(guild.id);
  const config = {
    ...DEFAULT_ANTISPAM,
    ...guildData.settings?.antispam
  };

  if (!config.enabled) return { spam: false };

  if (isWhitelisted(message, config)) return { spam: false };

  if (!buckets.has(guild.id)) buckets.set(guild.id, new Map());
  const guildMap = buckets.get(guild.id);

  if (!guildMap.has(author.id)) {
    guildMap.set(author.id, {
      timestamps: [],
      violations: 0,
      lastViolation: 0
    });
  }

  const user = guildMap.get(author.id);

  // reset violations after 2 minutes
  if (now - user.lastViolation > 120000) user.violations = 0;

  user.timestamps = user.timestamps.filter(t => now - t < config.window);
  user.timestamps.push(now);

  if (user.timestamps.length <= config.limit) return { spam: false };

  user.violations++;
  user.lastViolation = now;

  return { spam: true, violations: user.violations, config };
}

/**
 * Quick toggle
 */
import { updateGuild } from "./guildService.js";

export function toggleAntiSpam(guildId) {
  const guild = getGuild(guildId);

  guild.settings.antispam ??= {};
  guild.settings.antispam.enabled = !guild.settings.antispam.enabled;

  updateGuild(guildId, guild.settings);

  return guild.settings.antispam.enabled;
}
