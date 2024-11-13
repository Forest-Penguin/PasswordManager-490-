// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadFile(path.join(__dirname, 'renderer/setup.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('select-usb-drive', async (event) => {
    const result = await dialog.showOpenDialog(win, { properties: ['openDirectory'] });
    if (!result.canceled && result.filePaths.length > 0) {
        const usbPath = result.filePaths[0];
        event.reply('usb-selected', usbPath);
    } else {
        event.reply('usb-error', 'No USB drive selected.');
    }
});

ipcMain.on('initialize-usb', (event, { password, usbPath }) => {
    const python = spawn('python3', ['backend/password_manager.py', 'initialize_master', password, usbPath]);
    python.stdout.on('data', (data) => {
        const response = JSON.parse(data.toString());
        event.reply('usb-initialized', response.message);
    });
});

ipcMain.on('authenticate', (event, { password, usbPath }) => {
    const python = spawn('python3', ['backend/password_manager.py', 'authenticate', password, usbPath]);
    python.stdout.on('data', (data) => {
        const response = JSON.parse(data.toString());
        event.reply('auth-response', response.message);
    });
});

ipcMain.on('add-password', (event, { service, username, password }) => {
    const python = spawn('python3', ['backend/password_manager.py', 'add_password', service, username, password]);
    python.stdout.on('data', (data) => {
        const response = JSON.parse(data.toString());
        event.reply('password-saved', response.message);
    });
});

ipcMain.on('get-passwords', (event) => {
    const python = spawn('python3', ['backend/password_manager.py', 'get_passwords']);
    python.stdout.on('data', (data) => {
        const passwords = JSON.parse(data.toString());
        event.reply('passwords-retrieved', passwords);
    });
});
