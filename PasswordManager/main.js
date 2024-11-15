const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');

let mainWindow;
const APP_DATA_PATH = path.join(app.getPath('userData'), 'appData.json');

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false
        }
    });

    // Load appropriate page based on setup completion
    const isSetupComplete = fs.existsSync(APP_DATA_PATH);
    const initialPage = isSetupComplete ? 'login.html' : 'setup.html';
    mainWindow.loadFile(path.join(__dirname, 'renderer', initialPage))
        .catch(err => console.error(`Failed to load ${initialPage}:`, err));
}

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// USB selection dialog for both setup and login pages
ipcMain.on('select-usb', async (event) => {
    try {
        const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
        
        if (result.canceled || result.filePaths.length === 0) {
            event.reply('usb-selection-failed', 'No USB selected.');
            return;
        }
        
        const usbPath = result.filePaths[0];
        event.reply('usb-selected', usbPath);
    } catch (error) {
        console.error('Error selecting USB:', error);
        event.reply('usb-selection-failed', 'USB selection failed.');
    }
});

// USB setup process for initial setup
ipcMain.on('setup-usb', (event, usbPath) => {
    const python = spawn('python', ['PasswordManager/backend/password_manager.py', 'setup', usbPath]);

    python.stdout.on('data', (data) => {
        const generatedPassword = data.toString().trim();
        event.reply('setup-complete', generatedPassword);

        // Mark setup as complete and store hashed password in APP_DATA_PATH
        fs.writeFileSync(APP_DATA_PATH, JSON.stringify({ setupComplete: true, hashedPassword: generatedPassword }));
    });

    python.stderr.on('data', (data) => {
        console.error(`Setup error from Python: ${data}`);
        event.reply('setup-failed', 'Failed to set up USB.');
    });
});

// USB verification for login
ipcMain.on('verify-usb', (event, usbPath) => {
    const python = spawn('python', ['PasswordManager/backend/password_manager.py', 'verify', usbPath]);

    python.stdout.on('data', (data) => {
        const result = data.toString().trim();
        if (result === 'success') {
            event.reply('login-success');
        } else {
            event.reply('login-failed', 'Incorrect USB or password.');
        }
    });

    python.stderr.on('data', (data) => {
        console.error(`Verification error from Python: ${data}`);
        event.reply('login-failed', 'Error during USB verification.');
    });
});

// Transition to login page after successful setup
ipcMain.on('load-login-page', () => {
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'login.html'))
        .catch(err => console.error('Failed to load login.html:', err));
});

// Password Manager Handlers

// Fetch all stored passwords
ipcMain.handle('fetch-passwords', async () => {
    const python = spawnSync('python', ['PasswordManager/backend/password_manager.py', 'fetch']);
    return JSON.parse(python.stdout.toString());
});

// Add a new password
ipcMain.on('add-password', (event, passwordData) => {
    spawnSync('python', ['PasswordManager/backend/password_manager.py', 'add', JSON.stringify(passwordData)]);
    mainWindow.webContents.send('password-changed');
});

// Edit an existing password
ipcMain.on('edit-password', (event, updateData) => {
    spawnSync('python', ['PasswordManager/backend/password_manager.py', 'edit', JSON.stringify(updateData)]);
    mainWindow.webContents.send('password-changed');
});

// Delete a password
ipcMain.on('delete-password', (event, id) => {
    spawnSync('python', ['PasswordManager/backend/password_manager.py', 'delete', id]);
    mainWindow.webContents.send('password-changed');
});

// Generate a random password
ipcMain.handle('generate-password', async () => {
    const python = spawnSync('python', ['PasswordManager/backend/password_manager.py', 'generate']);
    return python.stdout.toString().trim();
});
