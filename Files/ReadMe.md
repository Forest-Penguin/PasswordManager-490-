# Local Password Manager and Generator

## Overview
The **Local Password Manager and Generator** is a desktop application designed to securely generate and manage passwords. It emphasizes user privacy by storing all sensitive data locally and leveraging strong encryption. The project is implemented using **Electron.js** for the frontend and **Python** for backend operations, incorporating hardware-based authentication (USB) and password breach checks via the **Have I Been Pwned** API.

## Features

### Core Features
- **USB Authentication and Master Password**: Multi-factor authentication using a USB device and a master password for accessing the password manager.
- **Password Management**: Users can create, read, update, and delete passwords securely. All passwords are encrypted using **AES-256** before being stored.
- **Password Generator**: Customizable password generation, including length, characters, and symbols.
- **Password Breach Check**: Integration with the **Have I Been Pwned** API to determine if a password has been compromised.

### Additional Features
- **Theme Customization**: Light/Dark mode for user preferences.
- **Password Strength Indicator**: Real-time analysis and feedback on password strength.
- **Encrypted Import/Export**: Ability to back up and restore the password database.

## Technologies Used
- **Frontend**: **Electron.js** with JavaScript for the UI.
- **Backend**: **Python** for core operations, including encryption, USB-based authentication, and API integration.
- **Encryption**: **AES-256** for passwords and **bcrypt** for hashing the master password.
- **Database**: **SQLite** is used to store encrypted password data locally.
- **Libraries**:
  - **Cryptography** (AES-256)
  - **PyUSB** for USB interactions
  - **requests** for API calls to **Have I Been Pwned**

## Setup Instructions

### Prerequisites
- **Node.js** and **npm**: Required for **Electron.js**.
- **Python**: Install Python 3 and required libraries listed in `requirements.txt`.
- **Electron Forge**: Used for packaging the application.

### Installation
1. **Clone the Repository**:
   ```bash
   git clone [repository-url]
   ```

2. **Install Frontend Dependencies**:
   ```bash
   cd path/to/project
   npm install
   ```

3. **Install Backend Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**:
   ```bash
   npm start
   ```

### Usage
- **Initial Setup**: Insert a USB and follow the on-screen instructions to set up the master password.
- **Password Management**: Once logged in, users can add, edit, delete, or check passwords.
- **Password Breach Check**: Use the "Check Password Safety" button to verify a password against known data breaches.

## Folder Structure
- **backend/password\_manager.py**: Manages password encryption, USB authentication, and interactions with **Have I Been Pwned**.
- **frontend/main.js**: Handles the Electron window and communication with the backend.
- **frontend/preload.js**: Exposes API calls to the rendered pages.
- **frontend/renderer**:
  - **login.html**: USB-based login page.
  - **password\_manager.html**: Main interface for managing passwords.
  - **setup.html**: Initial setup page.

## Security Considerations
- **Data Protection**: Passwords are encrypted using **AES-256**, while the master password is hashed using **bcrypt**.
- **USB Authentication**: Ensures that only authorized users can access stored passwords.
- **Secure Communication**: API requests (e.g., **Have I Been Pwned**) use **HTTPS** to protect data in transit.

## Known Issues and Recommendations
### Issues
1. **PyUSB Integration**: The documentation mentions **PyUSB**, but the current implementation relies on manual USB selection dialogs. Consider updating the USB interaction module to automatically detect USB insertion.
2. **Encryption Scope**: Ensure that all stored data is encrypted, including user metadata. The current backend script (`password_manager.py`) does not reference database encryption explicitly, which conflicts with the **PRD** and **Security Issues** documents.
3. **API Attribution**: Confirm that proper attribution is included for **Have I Been Pwned** usage in the UI and documentation, as specified in the **Legal Issues** document.

### Recommendations
- **USB Integration Enhancement**: Update USB detection to provide a smoother user experience using **PyUSB** or an equivalent tool.
- **Security Best Practices**: Implement regular checks to verify that the AES-256 encryption and hashing operations comply with best practices.

## License
This project uses third-party libraries under **MIT**, **Apache**, and **BSD** licenses. Make sure to comply with all licensing requirements for redistribution.

## Contributors
- **Project Manager**: Albert
- **Editor**: Aldrind
- **Database Developer**: Ramita
- **Application Developer**: Mirta
- **Lead Architect**: Monte

