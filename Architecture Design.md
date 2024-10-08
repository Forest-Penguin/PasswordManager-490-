Architecture Document

1. Overview

This document provides an overview of the architecture for the Local Password Manager and Generator web app. It outlines the major components of the system, including database models, views, controllers, URLs, and design considerations.

2. Languages/Frameworks/Libraries/Services/APIs

Languages:
Python: Backend logic, encryption, USB authentication, and handling API requests.
JavaScript: Frontend logic, user interface, handling user input, and event detection (e.g., USB insertion).

Frameworks:
Electron.js: For building the desktop application.
Flask (or Django): For handling backend APIs if applicable.

Libraries:
Cryptography (Python): AES-256 encryption for password storage.
PyUSB: For handling USB-based authentication.
bcrypt: For hashing master passwords.
requests: For accessing the Have I Been Pwned API.
sqlite3 (or SQLAlchemy for Flask/Django): For local storage of password data.

Services/APIs:
Have I Been Pwned API: To check for compromised passwords and alert users.

3. Package/Build Manager
NPM: To manage JavaScript dependencies for frontend components.
Pip: To manage Python libraries used in the backend.
Electron Forge: For building and packaging the desktop application.

4. Task Assignments
Person 1: Frontend development using Electron.js and JavaScript (UI/UX design, form handling, password management views).
Person 2: Backend development using Python (password encryption, database management, API integration).
Person 3: USB authentication module using PyUSB, cryptography for securing master passwords.
Person 4: API integration (Have I Been Pwned), writing Python scripts for API calls, and handling API responses.

5. Deployment

5.1 Deployment Strategy
Local App Deployment:
The app will be distributed as a desktop application, packaged using Electron Forge.
Users can install the app on Windows, macOS, or Linux environments.

5.2 Hosting
Since this is a local app, no cloud-based hosting is required unless a backend web API is added for additional functionality (e.g., Flask/Django hosted on Heroku or AWS for remote API management).

6. Development/Deployment Environments

Development Environment:
VMs or Containers: Use Docker for isolating the development environment, especially for the backend and API services.

Local Environment:
Electron.js: For the local frontend (desktop app).
Flask/Django: For handling API requests locally if needed.

7. Type of Web App
Traditional Desktop Application: The app will run as a desktop application using Electron.js, meaning it's not an SPA or a traditional web app.

8. Controllers

Main Controller:
Handles communication between the frontend and backend.
Manages USB authentication, password generation, and password storage.

Password Controller:
Manages the password generation process and interacts with the database to store/retrieve passwords.

HIBP Controller:
Sends user passwords to the Have I Been Pwned API to check for breaches and handle responses.

9. Views

9.1 Login View
Header: Prompts the user to insert their USB and enter the master password.
Content: Password input field, USB detection status, and login button.

9.2 Password Manager View
Header: Navigation bar with options for generating new passwords and viewing stored passwords.
Content: List of stored passwords with options to copy, delete, or check if compromised (using the HIBP API).

Menu: Sidebar with navigation options for password generation, password check, and settings.

9.3 Password Generator View
Content: Options to customize the password (length, symbols, etc.) and a "Generate" button. The generated password can be copied or saved.

10. URLs
For each of these URLs, describe what they do if this is a web app:

/login: Login page (USB authentication + password entry).
/passwords: Displays a list of stored passwords.
/generate-password: Interface for generating new passwords.
/check-compromise: Check if a stored password is compromised using the Have I Been Pwned API.

11. REST API
/api/passwords:
Method: GET
Description: Retrieves the list of stored passwords from the local database.
/api/generate-password:

Method: POST
Parameters: Password length, options for symbols/numbers.
Description: Generates a new password based on user preferences.
/api/check-compromise:

Method: POST
Parameters: Password to check.
Description: Checks the given password against the Have I Been Pwned API for breaches.

12. Database Schema
Users Table:
Attributes:
id: Integer (Primary Key)
username: String
master_password_hash: String (Hashed master password)
Passwords Table:
Attributes:
id: Integer (Primary Key)
user_id: Integer (Foreign Key from Users Table)
password: String (Encrypted password)
service: String (Website or service the password is associated with)
is_compromised: Boolean (Flag for compromised passwords)

13. Common Queries

Retrieve all passwords for a user:
SELECT * FROM passwords WHERE user_id = ?;

Check if a password is compromised:
SELECT * FROM passwords WHERE is_compromised = 1 AND user_id = ?;
