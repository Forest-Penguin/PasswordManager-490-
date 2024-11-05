import sys
import bcrypt
import os

def save_to_usb(hashed_password):
    usb_drive_path = "/media/usb"  # Modify this based on the OS and USB mount path
    file_path = os.path.join(usb_drive_path, "master_password.txt")
    
    try:
        with open(file_path, "wb") as file:
            file.write(hashed_password)
        return "USB initialized successfully with your master password."
    except Exception as e:
        return f"Failed to initialize USB: {e}"

def initialize_master_password(password):
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    # Save to USB
    return save_to_usb(hashed_password)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("No password provided.")
    else:
        password = sys.argv[1]
        result = initialize_master_password(password)
        print(result)
