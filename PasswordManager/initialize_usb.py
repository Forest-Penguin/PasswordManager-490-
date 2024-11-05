import sys
import bcrypt
import os

def save_to_usb(usb_path, hashed_password):
    file_path = os.path.join(usb_path, "master_password.txt")
    
    try:
        with open(file_path, "wb") as file:
            file.write(hashed_password)
        return "USB initialized successfully with your master password."
    except Exception as e:
        return f"Failed to initialize USB: {e}"

def initialize_master_password(usb_path, password):
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    # Save to USB
    return save_to_usb(usb_path, hashed_password)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("No USB path or password provided.")
    else:
        usb_path = sys.argv[1]
        password = sys.argv[2]
        result = initialize_master_password(usb_path, password)
        print(result)
