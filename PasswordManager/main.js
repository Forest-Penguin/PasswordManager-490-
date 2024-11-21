const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');

// Resolve paths
const APP_DATA_PATH = path.join(app.getPath('userData'), 'appData.json');
const BACKEND_SCRIPT = path.join(__dirname, 'backend', 'password_manager.py');
const RENDERER_PATH = path.join(__dirname, 'renderer');

let mainWindow;

// Function to create the main application window
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
    mainWindow.loadFile(path.join(RENDERER_PATH, initialPage))
        .catch(err => console.error(`Failed to load ${initialPage}:`, err));
}


    // Start monitoring USB devices
    usbDetect.startMonitoring();

    // USB detection events
    usbDetect.on('add', (device) => {
        const usbPath = `/media/${device.manufacturer}/${device.deviceName}`; // Adjust logic for your OS
        console.log('USB device added:', usbPath);
        mainWindow.webContents.send('usb-detected', usbPath);
    });

    usbDetect.on('remove', (device) => {
        console.log('USB device removed:', device);
        mainWindow.webContents.send('usb-removed', 'A USB drive was disconnected.');
    });

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});




// Application ready event
app.whenReady().then(createMainWindow);

// Quit the application when all windows are closed
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
    const python = spawn('python', [BACKEND_SCRIPT, 'setup', usbPath]);

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
    const python = spawn('python', [BACKEND_SCRIPT, 'verify', usbPath]);

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
    mainWindow.loadFile(path.join(RENDERER_PATH, 'login.html'))
        .catch(err => console.error('Failed to load login.html:', err));
});

// Password Manager Handlers

// Fetch all stored passwords
ipcMain.handle('fetch-passwords', async () => {
    const python = spawnSync('python', [BACKEND_SCRIPT, 'fetch']);
    return JSON.parse(python.stdout.toString());
});

// Add a new password
ipcMain.on('add-password', (event, passwordData) => {
    const result = spawnSync('python', [BACKEND_SCRIPT, 'add', JSON.stringify(passwordData)]);
    console.log("Password Add Result:", result.stdout.toString()); // Debug log
    mainWindow.webContents.send('password-changed'); // Notify renderer
});


// Edit an existing password
ipcMain.on('edit-password', (event, updateData) => {
    console.log("Editing password:", updateData); // Debug log
    spawnSync('python', [BACKEND_SCRIPT, 'edit', JSON.stringify(updateData)]);
    
    // Emit password-changed event to notify frontend
    mainWindow.webContents.send('password-changed');
});

// Delete a password
ipcMain.on('delete-password', (event, id) => {
    spawnSync('python', [BACKEND_SCRIPT, 'delete', id]);
    mainWindow.webContents.send('password-changed');
});

// Generate a random password
ipcMain.handle('generate-password', async () => {
    const python = spawnSync('python', [BACKEND_SCRIPT, 'generate']);
    return python.stdout.toString().trim();
});

// Check if a password has been pwned
ipcMain.handle('check-password-pwned', async (event, password) => {
    const python = spawnSync('python', [BACKEND_SCRIPT, 'check-pwned', password]);
    const result = python.stdout.toString().trim();
    return result === 'True';
});
