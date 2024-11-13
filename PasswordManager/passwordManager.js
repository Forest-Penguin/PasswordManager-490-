const { ipcRenderer } = require('electron');

// Show the add password form when the button is clicked
document.getElementById('add-password').addEventListener('click', () => {
    document.getElementById('add-password-form').style.display = 'block';
});

// Hide the add password form when cancel is clicked
document.getElementById('cancel-add').addEventListener('click', () => {
    document.getElementById('add-password-form').style.display = 'none';
});

// Save the new password
document.getElementById('save-password').addEventListener('click', () => {
    const service = document.getElementById('service').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validate input
    if (!service || !username || !password) {
        alert("All fields are required.");
        return;
    }

    // Send the data to the main process
    ipcRenderer.send('add-password', { service, username, password });

    // Clear form inputs and hide the form
    document.getElementById('service').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('add-password-form').style.display = 'none';
});

// Handle the response from the main process
ipcRenderer.on('password-saved', (event, message) => {
    alert(message);
    ipcRenderer.send('get-passwords'); // Refresh the list after adding a password
});

ipcRenderer.on('password-save-failed', (event, message) => {
    alert(message);
});

// Load saved passwords on page load
window.onload = function () {
    ipcRenderer.send('get-passwords');
};

// Display the list of saved passwords
ipcRenderer.on('passwords-retrieved', (event, passwords) => {
    const passwordList = document.getElementById('passwords');
    passwordList.innerHTML = '';

    if (passwords.length === 0) {
        passwordList.innerHTML = '<p>No passwords stored.</p>';
        return;
    }

    passwords.forEach(password => {
        const passwordDiv = document.createElement('div');
        passwordDiv.innerHTML = `
            <p><strong>Service:</strong> ${password.service}</p>
            <p><strong>Username:</strong> ${password.username}</p>
            <p><strong>Password:</strong> ${password.password}</p>
            <button onclick="deletePassword(${password.id})">Delete</button>
        `;
        passwordList.appendChild(passwordDiv);
    });
});

// Delete a password
function deletePassword(id) {
    ipcRenderer.send('delete-password', id);
}

ipcRenderer.on('password-deleted', () => {
    ipcRenderer.send('get-passwords');
});
