
# Password Manager 490

This is a local password manager application designed to securely store, generate, and verify passwords using USB-based authentication. The app is built using Python for backend functionality and Electron for the frontend.

---

## External Requirements

### Prerequisites:

1. **Node.js**:
   - Download and install Node.js from [https://nodejs.org/](https://nodejs.org/).
   - Ensure `npm` (Node Package Manager) is included.

2. **Python**:
   - Install Python 3.x from [https://www.python.org/](https://www.python.org/).
   - Ensure `pip` (Python Package Installer) is available.

3. **SQLite3**:
   - Pre-installed with most Python distributions.
   - If not available, follow installation instructions for your OS: [SQLite Download](https://www.sqlite.org/download.html).

4. **USB Drive**:
   - A USB drive is required for the authentication process.

---

### Dependencies:

#### Python Dependencies:
The following Python modules are required and should be installed via `pip`:
1. **requests**:
   - Used for integrating with the Have I Been Pwned API.
   - Install using:
     ```bash
     pip install requests
     ```

2. **cryptography**:
   - Used for AES-256 encryption of sensitive data.
   - Install using:
     ```bash
     pip install cryptography
     ```

3. **pyusb**:
   - Used for USB device interactions.
   - Install using:
     ```bash
     pip install pyusb
     ```

#### Node.js Dependencies:
These dependencies are automatically installed by running `npm install`:
1. **bcrypt**:
   - For hashing passwords.
2. **crypto**:
   - Provides cryptographic functionality for secure operations.
3. **electron**:
   - Framework for building cross-platform desktop applications.
4. **electron-squirrel-startup**:
   - Supports auto-update and startup for Windows.
5. **sqlite3**:
   - Provides SQLite database support.

#### Development Dependencies (Installed via `npm install`):
1. **@electron-forge/cli**: CLI for Electron Forge.
2. **@electron-forge/maker-deb**: Creates distributable packages for Linux (Debian).
3. **@electron-forge/maker-rpm**: Creates distributable packages for Linux (RPM).
4. **@electron-forge/maker-squirrel**: Creates Windows installers.
5. **@electron-forge/maker-zip**: Generates ZIP packages for distribution.
6. **@electron-forge/plugin-auto-unpack-natives**: Automatically unpacks native dependencies.
7. **@electron-forge/plugin-fuses**: Manages Electron fuses.

---

## Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd PasswordManager-490
   ```

2. **Install Node.js Dependencies**:
   Run this command to install all Node.js dependencies:
   ```bash
   npm install
   ```

3. **Install Python Dependencies**:
   Install the required Python modules:
   ```bash
   pip install requests cryptography pyusb
   ```

4. **Configure the USB Device**:
   - Run the application using `npm start`.
   - Use the `setup.html` page to select a USB drive for authentication. A unique hashed password will be generated and saved on the USB and locally.

---

## Running

### Start the Application:
To launch the app:
```bash
npm start
```

---

## Deployment

### Create Installers:
To generate distributable installers for Windows:
```bash
npm run make
```
The output files will be available in the `out/make` directory.

---

## Testing

### Manual Testing:
1. Launch the app with `npm start`.
2. Test USB setup via `setup.html`.
3. Verify login functionality and password management on `login.html` and `password_manager.html`.

### Automated Testing:
Automated testing has not been implemented yet. For future enhancements, consider using tools like Jest (for Node.js) or pytest (for Python).

---

## Dependencies Overview

### Python:
- **requests**: For API integration.
- **cryptography**: For AES-256 encryption.
- **pyusb**: For USB interactions.

Install them using:
```bash
pip install requests cryptography pyusb
```

### Node.js:
- Installed automatically via:
  ```bash
  npm install
  ```

---

## Authors

- **Aldrind Reyes**  
  Email: [aldrind.reyes-reyes.799@my.csun.edu]
- **Albert Atshemyan**  
  Email: [albert.atshemyan.697@my.csun.edu]
- **Mirta Mazariego**  
  Email: [mirta.mazariego.717@my.csun.edu]
- **Ramita Batchu**  
  Email: [ramita.batchu.865@my.csun.edu]
- **Monte Tamazyan**  
  Email: [monte.tamazyan.381@my.csun.edu]
---
