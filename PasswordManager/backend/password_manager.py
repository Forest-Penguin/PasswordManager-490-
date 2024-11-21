import sys
import os
import json
import hashlib
import random
import string
import requests  # Added for API calls

# File paths
PASSWORD_FILE_PATH = 'password_store.json'  # Local JSON file for storing passwords
APP_DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'userData', 'appData.json')

HIBP_API_URL = "https://api.pwnedpasswords.com/range/"

# Setup and Verification Functions

def generate_password():
    """Generates a random password."""
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for i in range(16))

def hash_password(password):
    """Hashes a password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()

def setup_usb(usb_path):
    """Generates and stores a hashed password on the USB and locally in appData.json."""
    password = generate_password()
    hashed_password = hash_password(password)

    # Save hashed password to a file on the USB
    with open(os.path.join(usb_path, 'password_hash.txt'), 'w') as f:
        f.write(hashed_password)
    
    # Save hashed password locally in appData.json
    os.makedirs(os.path.dirname(APP_DATA_PATH), exist_ok=True)
    with open(APP_DATA_PATH, 'w') as f:
        json.dump({"setupComplete": True, "hashedPassword": hashed_password}, f)

    # Output the generated password for display in the setup page
    print(password)
    sys.stdout.flush()

def verify_usb(usb_path):
    """Verifies if the USB contains the correct password hash by comparing it to the locally stored hash."""
    usb_hash_path = os.path.join(usb_path, 'password_hash.txt')
    
    # Check if the password hash file exists on the USB
    if not os.path.exists(usb_hash_path):
        print("fail")
        sys.stdout.flush()
        return

    # Read the hash from the USB
    with open(usb_hash_path, 'r') as f:
        usb_hash = f.read().strip()

    # Load the locally stored hash
    if not os.path.exists(APP_DATA_PATH):
        print("fail")
        sys.stdout.flush()
        return

    with open(APP_DATA_PATH, 'r') as f:
        saved_data = json.load(f)
        local_hash = saved_data.get('hashedPassword', '')

    # Check if the hashes match
    if usb_hash == local_hash:
        print("success")
    else:
        print("fail")
    sys.stdout.flush()

# Password Management Functions

def fetch_passwords():
    """Fetches all stored passwords from PASSWORD_FILE_PATH."""
    if os.path.exists(PASSWORD_FILE_PATH):
        with open(PASSWORD_FILE_PATH, 'r') as f:
            return json.load(f)
    return []

def add_password(data):
    """Adds a new password entry to PASSWORD_FILE_PATH."""
    passwords = fetch_passwords()
    data['id'] = str(len(passwords) + 1)  # Assign a simple unique ID
    passwords.append(data)
    save_passwords(passwords)

def edit_password(id, new_password):
    """Edits an existing password entry in PASSWORD_FILE_PATH by ID."""
    passwords = fetch_passwords()
    print(f"Editing password ID: {id}, New Password: {new_password}")  # Debug log
    for pwd in passwords:
        if pwd['id'] == id:  # Match the ID
            pwd['password'] = new_password  # Update password
            break
    save_passwords(passwords)


def delete_password(id):
    """Deletes a password entry from PASSWORD_FILE_PATH by ID."""
    passwords = [pwd for pwd in fetch_passwords() if pwd['id'] != id]
    save_passwords(passwords)

def save_passwords(passwords):
    """Saves the password list to PASSWORD_FILE_PATH."""
    with open(PASSWORD_FILE_PATH, 'w') as f:
        json.dump(passwords, f)



# Have I Been Pwned API Integration

def check_password_pwned(password):
    """
    Checks if a password has been exposed in a data breach using the Have I Been Pwned API.
    The API uses the k-Anonymity model to protect privacy.
    """
    # Hash the password using SHA-1
    sha1_password = hashlib.sha1(password.encode()).hexdigest().upper()
    prefix, suffix = sha1_password[:5], sha1_password[5:]

    # Query the API with the first 5 characters of the hash
    response = requests.get(f"{HIBP_API_URL}{prefix}")

    if response.status_code != 200:
        print(f"Error fetching data from HIBP API: {response.status_code}")
        sys.stdout.flush()
        return

    # Check if the suffix exists in the response
    hashes = (line.split(":") for line in response.text.splitlines())
    for hash_suffix, count in hashes:
        if suffix == hash_suffix:
            print("True")  # Password is pwned
            sys.stdout.flush()
            return

    print("False")  # Password is safe
    sys.stdout.flush()

# Command Line Interface for Electron Backend Integration

if __name__ == "__main__":
    command = sys.argv[1]
    
    if command == 'setup':
        usb_path = sys.argv[2]
        setup_usb(usb_path)
    elif command == 'verify':
        usb_path = sys.argv[2]
        verify_usb(usb_path)
    elif command == 'fetch':
        print(json.dumps(fetch_passwords()))
    elif command == 'add':
        data = json.loads(sys.argv[2])
        add_password(data)
    elif command == 'edit':
        update_data = json.loads(sys.argv[2])
        edit_password(update_data['id'], update_data['newPassword'])
    elif command == 'delete':
        id = sys.argv[2]
        delete_password(id)
    elif command == 'generate':
        print(generate_password())
    elif command == 'check-pwned':
        password = sys.argv[2]
        check_password_pwned(password)
