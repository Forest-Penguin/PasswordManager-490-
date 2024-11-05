# Security Issues

## Data Protection
Our Local Password Manager and Generator app employs robust encryption to safeguard user data:
- **AES-256 Encryption**: All passwords stored in the application are encrypted using AES-256.
- **bcrypt Hashing**: Master passwords are hashed using bcrypt before being stored, ensuring that they cannot be reverse-engineered.
- **USB-Based Authentication**: A secure USB is required to access the app, adding an extra layer of security.

## Authentication and Authorization
- **Two-Factor Authentication (2FA)**: The combination of the USB and master password acts as a 2FA system, ensuring users are properly authenticated.
- **Access Controls**: The app has clearly defined user roles and access controls, restricting what different users can do within the app.

## Common Vulnerabilities and Protection Measures
### SQL Injection
- **Protection**: The app uses parameterized queries to avoid SQL injection attacks.

### Cross-Site Scripting (XSS)
- **Not Applicable**: As a desktop application, XSS is less of a concern compared to web apps, but we ensure that no untrusted data is rendered.

### Cross-Site Request Forgery (CSRF)
- **Not Applicable**: CSRF typically affects web applications, and our local app does not have such exposures.

## Attack Vectors
### Client-Side Vulnerabilities
- **USB Authentication Exploits**: If an unauthorized person gains physical access to the USB, they might attempt to breach the app. We address this by requiring the USB and master password.
- **Protection**: The app locks after several failed attempts to enter the correct master password.

### Server-Side Vulnerabilities
- **API Calls**: Any API interaction with the Have I Been Pwned service uses **HTTPS** for secure communication.
- **Local Data Storage**: The use of AES-256 encryption ensures that even if local storage is compromised, data remains secure.

## Security Best Practices
- **Regular Security Audits**: We conduct regular audits to identify and mitigate security vulnerabilities.
- **Code Reviews**: Our team implements peer code reviews to catch potential issues early in the development process.
- **Use of Security Libraries**: We employ well-known security libraries and frameworks to ensure best practices are followed, including encryption and input validation.
