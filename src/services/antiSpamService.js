const messageBuckets = new Map();

/*
Structure:
messageBuckets = Map<
  guildId,
  Map<
    userId,
    { timestamps: number[] }
  >
>
*/

const LIMIT = 5;       // messages
const WINDOW = 5000;  // ms

export function checkSpam(guildId, userId) {
  const now = Date.now();

  if (!messageBuckets.has(guildId)) {
    messageBuckets.set(guildId, new Map());
  }

  const guildMap = messageBuckets.get(guildId);

  if (!guildMap.has(userId)) {
    guildMap.set(userId, { timestamps: [] });
  }

  const bucket = guildMap.get(userId);

  // Keep only timestamps within window
  bucket.timestamps = bucket.timestamps.filter(
    t => now - t < WINDOW
  );

  bucket.timestamps.push(now);

  return bucket.timestamps.length > LIMIT;
}
