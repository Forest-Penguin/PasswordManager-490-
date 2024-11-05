// Show the add password form
document.getElementById('add-password').addEventListener('click', () => {
    document.getElementById('add-password-form').style.display = 'block';
});

// Save the new password
document.getElementById('save-password').addEventListener('click', () => {
    const service = document.getElementById('service').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send the password data to the backend for saving
    window.api.send('add-password', { service, username, password });

    // Clear form and hide it
    document.getElementById('service').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('add-password-form').style.display = 'none';
});
