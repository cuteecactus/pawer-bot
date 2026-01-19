import Database from "better-sqlite3";
import fs from 'fs'
import path from "path";

const dataDir = path.resolve('data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const db = new Database("data/pawer.db");

// Load schema
const schema = fs.readFileSync("src/database/schema.sql", "utf-8");
db.exec(schema);

// Prepared statements 
export const statements = {
    getGuild: db.prepare(
        "SELECT * FROM guilds WHERE guild_id = ?"
    ),
    insertGuild: db.prepare(
        "INSERT OR IGNORE INTO guilds (guild_id, created_at) VALUES (?, ?)"
    ),
    updateGuild: db.prepare(
        "UPDATE guilds SET settings = ? WHERE guild_id = ?"
    )
};

statements.getUser = db.prepare(
    "SELECT * FROM users WHERE guild_id = ? AND user_id = ?"
);
statements.insertUser = db.prepare(
    "INSERT OR IGNORE INTO users (guild_id, user_id, data) VALUES (?, ?, ?)"
);
statements.updateUser = db.prepare(
    "UPDATE users SET data = ? WHERE guild_id = ? AND user_id = ?"
);


export default db;