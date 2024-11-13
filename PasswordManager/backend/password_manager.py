# backend/password_manager.py
import sqlite3
import json
import sys
import os
import bcrypt
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

DB_PATH = 'passwords.db'
SECRET_KEY = b'your_secret_key_here'  # Ensure this key is 32 bytes for AES-256

def initialize_db():
    """Initializes the database if it doesn't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service TEXT,
        username TEXT,
        encrypted_password BLOB,
        iv BLOB
    )''')
    conn.commit()
    conn.close()

def encrypt_password(password):
    """Encrypts a password using AES encryption."""
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(SECRET_KEY), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    padded_password = password.ljust(32).encode()  # Pad to 32 bytes
    encrypted = encryptor.update(padded_password) + encryptor.finalize()
    return encrypted, iv

def decrypt_password(encrypted_password, iv):
    """Decrypts a password."""
    cipher = Cipher(algorithms.AES(SECRET_KEY), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted = decryptor.update(encrypted_password) + decryptor.finalize()
    return decrypted.decode().strip()

def add_password(service, username, password):
    """Adds an encrypted password to the database."""
    encrypted_password, iv = encrypt_password(password)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO passwords (service, username, encrypted_password, iv) VALUES (?, ?, ?, ?)',
                   (service, username, encrypted_password, iv))
    conn.commit()
    conn.close()
    print(json.dumps({"status": "success", "message": "Password saved successfully."}))

def get_passwords():
    """Retrieves all passwords from the database, decrypting each one."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT service, username, encrypted_password, iv FROM passwords')
    rows = cursor.fetchall()
    conn.close()
    passwords = [
        {"service": row[0], "username": row[1], "password": decrypt_password(row[2], row[3])}
        for row in rows
    ]
    print(json.dumps(passwords))

def initialize_master_password(password, usb_path):
    """Initializes the master password on the USB."""
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    usb_file = os.path.join(usb_path, 'master_password.txt')
    with open(usb_file, 'wb') as file:
        file.write(hashed_password)
    print(json.dumps({"status": "success", "message": "USB setup complete."}))

def authenticate_master_password(password, usb_path):
    """Authenticates the master password from the USB."""
    usb_file = os.path.join(usb_path, 'master_password.txt')
    if not os.path.exists(usb_file):
        print(json.dumps({"status": "error", "message": "No master password found on USB."}))
        return
    with open(usb_file, 'rb') as file:
        stored_hash = file.read()
    if bcrypt.checkpw(password.encode(), stored_hash):
        print(json.dumps({"status": "success", "message": "Authentication successful."}))
    else:
        print(json.dumps({"status": "error", "message": "Authentication failed."}))

if __name__ == "__main__":
    initialize_db()
    if len(sys.argv) > 1:
        action = sys.argv[1]
        if action == "add_password" and len(sys.argv) == 5:
            _, _, service, username, password = sys.argv
            add_password(service, username, password)
        elif action == "get_passwords":
            get_passwords()
        elif action == "initialize_master" and len(sys.argv) == 4:
            _, _, password, usb_path = sys.argv
            initialize_master_password(password, usb_path)
        elif action == "authenticate" and len(sys.argv) == 4:
            _, _, password, usb_path = sys.argv
            authenticate_master_password(password, usb_path)
        else:
            print(json.dumps({"status": "error", "message": "Invalid arguments."}))
    else:
        print(json.dumps({"status": "error", "message": "No action specified."}))
