# Project Requirement Document (PRD)

## Objective
Create a comprehensive PRD outlining the architecture and requirements for the **Local Password Manager and Generator** app.

## 1. Overview

This document outlines the main requirements for the **Local Password Manager and Generator** project. It serves as a key reference point, similar to a contract that would detail the features included in the software. 

The other part of the contract would cover payment details if this were a client project.

## 2. Feature Categories

### 2.1 Required Features (Core Functionality)
- **User Login via USB and Master Password**:
  - User must insert a USB drive containing an encrypted master password to log in.
- **Password Management (CRUD)**:
  - Create, read, update, and delete passwords securely in a local database.
- **Password Generator**:
  - Generate strong passwords with customizable parameters (e.g., length, special characters).
- **Password Security Check**:
  - Use the Have I Been Pwned API to check if stored passwords have been compromised.
- **Data Encryption**:
  - Encrypt all passwords using AES-256 and hash the master password using bcrypt.

### 2.2 Desired Features (Enhancements)
- **Dark/Light Mode Toggle**:
  - Add the ability to switch between dark and light themes in the app.
- **Password Strength Indicator**:
  - Provide feedback on the strength of passwords when created or modified.
- **Search Functionality**:
  - Search through stored passwords.
- **Export/Import Encrypted Passwords**:
  - Allow users to export and import encrypted passwords to/from external files.

### 2.3 Aspirational Features (Extra)
- **Biometric Authentication**:
  - Add optional fingerprint or facial recognition for additional security.
- **Multi-Device Syncing**:
  - Sync passwords across multiple devices with secure encryption and optional cloud backup.
- **Password Sharing**:
  - Enable secure sharing of selected passwords with trusted individuals.
- **Offline Access**:
  - Ensure users can access saved passwords without an internet connection.

## 3. Task Assignments
Each team member is responsible for different aspects of the project:

| Task                         | Assigned To | Description                                                                 |
|------------------------------|-------------|-----------------------------------------------------------------------------|
| Frontend Development (UI/UX)  | Person 1    | Design and develop the app interface using Electron.js. Includes Login View and Password Manager views. |
| Backend Development           | Person 2    | Handle password encryption, storage, and API integration using Python.       |
| USB Authentication Module     | Person 3    | Implement USB-based authentication with PyUSB and cryptography for decrypting the master password. |
| API Integration               | Person 4    | Integrate the Have I Been Pwned API for password breach checking.            |
| Password Generation           | Person 5    | Implement the customizable password generation feature.                      |

## 4. Design

### 4.1 System Architecture
The app follows a modular design, where each component (USB authentication, password management, encryption) is loosely coupled for easier maintenance and scalability.

![System Architecture Diagram](path-to-architecture-diagram.png)

### 4.2 Application Views
- **Login View**:
  - Users insert their USB drive and enter their master password to access stored passwords.
  - Fields: USB status, password input, and login button.
  
- **Password Manager View**:
  - Displays a list of stored passwords, allowing users to view, copy, delete, or check the status of each password (compromised or not).

- **Password Generator View**:
  - Allows users to generate new passwords with customizable options like length and inclusion of special characters.

## 5. Database Schema

The app uses an **SQLite** database for local storage of encrypted passwords.

### Tables:
- **Users Table**:
  - `id`: Integer (Primary Key)
  - `username`: String
  - `master_password_hash`: String (Hashed master password)
  
- **Passwords Table**:
  - `id`: Integer (Primary Key)
  - `user_id`: Integer (Foreign Key referencing Users Table)
  - `password`: String (Encrypted password)
  - `service`: String (The associated website or app)
  - `is_compromised`: Boolean (Indicates if the password is flagged as compromised)

## 6. Deployment
The app will be deployed locally as a cross-platform desktop application using **Electron.js**.

- **Build Tools**:
  - **NPM** for managing JavaScript dependencies.
  - **Pip** for managing Python libraries.

### 6.1 Development Environments
Each developer will set up their local environment using Electron.js and Python. **Docker** or **VMs** can be used to isolate development environments if needed.

### 6.2 Deployment Plan
- The app will be packaged as an executable using Electron’s build process for cross-platform deployment on Windows, macOS, and Linux. 

## 7. Goals

### 7.1 Usability
- Simulate user interaction by printing screens and testing the flow of the app.
  
### 7.2 Efficiency
- Make changes early in the development process, as these changes will be easier and less expensive than post-development changes.

## 8. Development Process

This PRD will be updated as the project evolves. 

Break down each feature into specific programming tasks/issues, assign them to team members, and track progress using GitHub. Repeat this process regularly to ensure all requirements are implemented efficiently.

---

**End of PRD**



