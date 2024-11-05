import sys
import bcrypt
import os

def authenticate(usb_path, password):
    file_path = os.path.join(usb_path, "master_password.txt")
    
    try:
        with open(file_path, "rb") as file:
            stored_hash = file.read()
            if bcrypt.checkpw(password.encode(), stored_hash):
                return "Login Successful"
            else:
                return "Login Failed"
    except Exception as e:
        return f"Failed to authenticate: {e}"

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("No USB path or password provided.")
    else:
        usb_path = sys.argv[1]
        password = sys.argv[2]
        result = authenticate(usb_path, password)
        print(result)
