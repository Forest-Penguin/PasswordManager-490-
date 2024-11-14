import sys
import os
import hashlib
import random
import string

def generate_password():
    # Generate a random 16-character password
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(characters) for i in range(16))
    return password

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def setup_usb(usb_path):
    # Generate and hash a password
    password = generate_password()
    hashed_password = hash_password(password)
    
    # Save hashed password to a file on the USB
    with open(os.path.join(usb_path, 'password_hash.txt'), 'w') as f:
        f.write(hashed_password)
    
    # Output the generated password for Electron to display
    print(password)
    sys.stdout.flush()

def verify_usb(usb_path):
    # Check if password hash file exists on the USB
    if not os.path.exists(os.path.join(usb_path, 'password_hash.txt')):
        print("fail")
        sys.stdout.flush()
        return

    # Read the hash from USB and compare it with the locally stored hash
    with open(os.path.join(usb_path, 'password_hash.txt'), 'r') as f:
        usb_hash = f.read().strip()
    
    # Load local app data to get the stored hash
    app_data_path = os.path.join(os.path.dirname(__file__), '..', 'userData', 'appData.json')
    with open(app_data_path, 'r') as f:
        saved_data = json.load(f)
        local_hash = saved_data.get('hashedPassword', '')

    # Check if the hashes match
    if usb_hash == local_hash:
        print("success")
    else:
        print("fail")
    sys.stdout.flush()

if __name__ == "__main__":
    command = sys.argv[1]
    if command == 'setup':
        usb_path = sys.argv[2]
        setup_usb(usb_path)
    elif command == 'verify':
        usb_path = sys.argv[2]
        verify_usb(usb_path)
