# Architecture Document

## 1. Overview
This document provides an overview of the architecture for the Local Password Manager and Generator desktop app.
It outlines the major components of the system, including data storage, views, and backend logic.

## 2. Languages/Frameworks/Libraries/Services/APIs
- **Languages**:
  - Python: Backend logic for encryption, password storage, and API interaction.
  - JavaScript: Frontend development using Electron.js for desktop interface and user interaction.

- **Frameworks**:
  - Electron.js: For building the desktop application UI and managing frontend/backend interactions.

- **Libraries**:
  - Cryptography (Python): AES-256 encryption for password storage.
  - PyUSB: For handling USB-based authentication.
  - bcrypt: For hashing the master password.
  - requests: For accessing the Have I Been Pwned API.
  - sqlite3 (Python): For local database management.

- **Services/APIs**:
  - Have I Been Pwned API: For checking compromised passwords.

## 3. Package/Build Manager
- **NPM**: Manages JavaScript dependencies for Electron.js.
- **Pip**: Manages Python libraries for encryption, USB authentication, and database management.

## 4. Task Assignments
- **Person 1**: Frontend development using Electron.js (UI/UX design, implementing the Login and Password Manager views).
- **Person 2**: Backend development with Python (password encryption, SQLite database management).
- **Person 3**: USB authentication module using PyUSB (handling USB interactions, validating master password on USB).
- **Person 4**: Integration of the Have I Been Pwned API (password breach checks, handling API responses).
- **Person 5**: Password generation logic (customizable password generation, integrating it into the UI).

## 5. Deployment
- **Local Deployment**: The app will be deployed as a desktop application using Electron.js. 
  It will run locally on Windows, macOS, and Linux.

## 6. Development/Deployment Environments
- **Development Environment**: Each developer will set up Electron.js and Python locally for development.
  Virtual machines or Docker may be used to isolate environments if needed.

## 7. Desktop Application Structure
### 7.1 Views (UI)
- **Login View**:
  - A screen where the user inserts a USB drive and enters the master password.
  - Fields: USB status, master password input, login button.
  
  ![image](https://github.com/user-attachments/assets/d871237b-870c-4c8c-adca-b3f7e08abc72)

- **Password Manager View**:
  - A screen that lists stored passwords and allows the user to manage them (copy, delete, or check if compromised).

![image](https://github.com/user-attachments/assets/6267bc36-aafc-4f68-b9e4-ca0f85f1ddd5)

- **Password Generator View**:
  - Interface for generating new passwords with customizable options (length, symbols, etc.).

![image](https://github.com/user-attachments/assets/6e1b97d6-8e5c-4186-8222-da067157905b)


### 7.2 Main Application Logic
- **USB Authentication Module**:
  - Listens for USB insertion and validates the master password stored on the USB drive.
  - Uses PyUSB to handle USB interactions and cryptography for decrypting the master password.

- **Password Generation Logic**:
  - Random password generator that allows customization (length, characters).
  - Integrated directly within the Python backend.

- **Password Storage and Encryption**:
  - SQLite database stores encrypted passwords locally using AES-256.

- **Password Security Check (HIBP Integration)**:
  - Sends a hash of the password to the Have I Been Pwned API to check for breaches.
  - Displays a warning if the password is compromised.

## 8. Data Storage
### 8.1 Database Schema
- **Users Table**:
  - `id`: Integer (Primary Key)
  - `username`: String
  - `master_password_hash`: String (Hashed master password)

- **Passwords Table**:
  - `id`: Integer (Primary Key)
  - `user_id`: Integer (Foreign Key from Users Table)
  - `password`: String (Encrypted password)
  - `service`: String (Website or service the password is associated with)
  - `is_compromised`: Boolean (Flag for compromised passwords)

## 9. Design Considerations
- **USB Authentication**:
  - Keep USB authentication logic separate from password management to ensure modularity.
  - Handle cases when the USB drive is removed or the master password is incorrect.
  
- **Password Management**:
  - Ensure all passwords are encrypted before being stored.
  - Implement hashing and salting techniques for the master password.

- **Performance Considerations**:
  - Optimize SQLite queries for retrieving passwords.
  - Minimize API calls to the Have I Been Pwned API by caching results if needed.

## 10. Common Queries
- **Retrieve all passwords for a user**:
```SQL
SELECT * FROM passwords WHERE user_id = ?;

```
![image](https://github.com/user-attachments/assets/e93fb89b-995a-476b-b8ae-7553c12d2ec0)

[ArchitectureDesignVisio.pdf](https://github.com/user-attachments/files/17300222/ArchitectureDesignVisio.pdf)
![image](https://github.com/user-attachments/assets/f25d36f3-96ed-4b69-a2e5-1c11fd53244c)



