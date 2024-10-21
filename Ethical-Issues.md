# Ethical Issues

## User Privacy and Data Security
Our Local Password Manager and Generator app is designed to prioritize user privacy and data security. However, potential ethical concerns could arise if sensitive information is not properly protected. We address these by:
- **Data Encryption**: All passwords are encrypted using **AES-256** before being stored. This ensures that even if data is compromised, it cannot be easily accessed.
- **Master Password Protection**: The master password, used to access the application, is hashed using **bcrypt** and stored securely.
- **Transparency**: We are clear about what data is collected (only what is needed to provide the service) and how it is used. Users can access this information through our Privacy Policy.

## Avoiding Discrimination
Our software must be accessible and fair, regardless of users' race, gender, or other personal attributes. 
- **Design Inclusivity**: The UI design follows accessibility best practices to ensure it can be used by people with different abilities.
- **No Profiling or Data Aggregation**: We do not collect or process user data in a way that could lead to discriminatory profiling.

## Preventing Misuse
We have considered the possibility of misuse, such as individuals using our password manager to store illegal content or share sensitive information without permission.
- **Acceptable Use Policy**: Users are required to agree to an Acceptable Use Policy, which prohibits the storage or sharing of unlawful content.
- **Security Logging**: Unauthorized access attempts are logged, and multiple failed attempts result in a temporary lockout to deter misuse.
- **Encryption Key Management**: Encryption keys are managed locally, and data is never shared or stored in the cloud, reducing the risk of mass data misuse.
