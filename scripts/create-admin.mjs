// One-time setup script: creates (or resets) the single admin account.
// Run with:  npm run create-admin -- <username>
// Reads DB_* from .env.local. Prints a freshly generated password ONCE —
// save it immediately, it is not stored anywhere in recoverable form
// (only its bcrypt hash is written to the database).

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const username = process.argv[2];
if (!username) {
  console.error("Usage: npm run create-admin -- <username>");
  process.exit(1);
}

function generatePassword(length = 20) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#%^*_-+=";
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const password = generatePassword();
const hash = await bcrypt.hash(password, 12);

await pool.execute(
  `INSERT INTO admin_users (username, password_hash) VALUES (?, ?)
   ON DUPLICATE KEY UPDATE password_hash = ?, totp_secret = NULL, totp_enabled = 0`,
  [username, hash, hash]
);

console.log("\nAdmin account ready.");
console.log(`  Username: ${username}`);
console.log(`  Password: ${password}`);
console.log(
  "\nSave this password now — it will not be shown again. Log in at /studio/login, " +
    "then set up two-factor authentication from the Security page.\n"
);

await pool.end();
