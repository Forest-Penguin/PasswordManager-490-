import sys
import bcrypt
import os

def load_hashed_password():
    usb_drive_path = "/media/usb"  # Modify this path based on the OS and USB mount path
    file_path = os.path.join(usb_drive_path, "master_password.txt")

    try:
        with open(file_path, "rb") as file:
            return file.read()
    except FileNotFoundError:
        return None

def check_master_password(input_password):
    stored_hashed_password = load_hashed_password()
    if stored_hashed_password is None:
        return "USB not initialized or master password file missing."
    
    if bcrypt.checkpw(input_password.encode(), stored_hashed_password):
        return "Login Successful"
    else:
        return "Login Failed"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("No password provided.")
    else:
        input_password = sys.argv[1]
        print(check_master_password(input_password))
