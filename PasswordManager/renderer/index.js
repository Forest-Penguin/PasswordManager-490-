// renderer/index.js
const { ipcRenderer } = require('electron');

document.getElementById('add-password').onclick = () => {
    document.getElementById('add-password-form').style.display = 'block';
};

document.getElementById('save-password').onclick = () => {
    const service = document.getElementById('service').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    ipcRenderer.send('add-password', { service, username, password });
};

ipcRenderer.on('password-saved', (event, message) => alert(message));

ipcRenderer.on('passwords-retrieved', (event, passwords) => {
    document.getElementById('passwords').innerHTML = passwords.map(p => `
        <div>
            <strong>Service:</strong> ${p.service} <br>
            <strong>Username:</strong> ${p.username} <br>
            <strong>Password:</strong> ${p.password}
        </div>
    `).join('');
});
