import sys
import sqlite3
from cryptography.fernet import Fernet

# Load your encryption key
key = b'your_generated_key_here'  # Replace with your stored key
cipher = Fernet(key)

def add_password(service, username, password):
    # Encrypt the password
    encrypted_password = cipher.encrypt(password.encode())

    # Connect to the SQLite database and save the entry
    conn = sqlite3.connect('passwords.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS passwords (
            id INTEGER PRIMARY KEY,
            service TEXT,
            username TEXT,
            encrypted_password TEXT
        )
    ''')
    cursor.execute("INSERT INTO passwords (service, username, encrypted_password) VALUES (?, ?, ?)",
                   (service, username, encrypted_password))
    conn.commit()
    conn.close()

    print("Password added successfully")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: add_password.py <service> <username> <password>")
    else:
        add_password(sys.argv[1], sys.argv[2], sys.argv[3])
