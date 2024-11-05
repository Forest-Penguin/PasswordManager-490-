import hashlib
import requests
import sys

def check_password_pwned(password):
    sha1_password = hashlib.sha1(password.encode()).hexdigest().upper()
    prefix, suffix = sha1_password[:5], sha1_password[5:]
    response = requests.get(f'https://api.pwnedpasswords.com/range/{prefix}')
    return suffix in response.text

# Run check with passed-in password
if __name__ == "__main__":
    password = sys.argv[1]
    if check_password_pwned(password):
        print("This password has been compromised.")
    else:
        print("This password is safe.")
