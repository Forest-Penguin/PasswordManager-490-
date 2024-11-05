import usb.core
import sqlite3
from cryptography.fernet import Fernet

# USB Authentication
def check_usb_device(vendor_id, product_id):
    device = usb.core.find(idVendor=vendor_id, idProduct=product_id)
    return device is not None

# Encryption Setup
key = b'your_generated_key_here'  # Replace with your AES key
cipher = Fernet(key)

# Database setup
conn = sqlite3.connect('passwords.db')
cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY,
        service TEXT,
        encrypted_password TEXT
    )
''')

# Add and Retrieve password functions
def add_password(service, password):
    encrypted = cipher.encrypt(password.encode())
    cursor.execute("INSERT INTO passwords (service, encrypted_password) VALUES (?, ?)", (service, encrypted))
    conn.commit()

def get_password(service):
    cursor.execute("SELECT encrypted_password FROM passwords WHERE service = ?", (service,))
    encrypted_password = cursor.fetchone()[0]
    return cipher.decrypt(encrypted_password).decode()
