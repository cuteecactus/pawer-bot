CREATE TABLE IF NOT EXISTS guilds (
    guild_id TEXT PRIMARY KEY,
    prefix TEXT DEFAULT  '!',
    settings TEXT,
    created_at INTEGER
);

CREATE TABLE IF NOT EXISTS users (
    guild_id TEXT,
    user_id TEXT,
    data TEXT,
    PRIMARY KEY (guild_id, user_id)
)