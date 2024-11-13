const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'passwords.db'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service TEXT,
        username TEXT,
        encrypted_password TEXT,
        iv TEXT
    )`);
});

const algorithm = 'aes-256-cbc';
const secretKey = 'your_secret_key_here';
const iv = crypto.randomBytes(16);

function encryptPassword(password) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    return { encrypted, iv: iv.toString('hex') };
}

function decryptPassword(encrypted, iv) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}

module.exports = { db, encryptPassword, decryptPassword };
