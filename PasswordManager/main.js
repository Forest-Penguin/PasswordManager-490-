const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
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

    // Check if setup has been completed by looking for APP_DATA_PATH
    const isSetupComplete = fs.existsSync(APP_DATA_PATH);
    const initialPage = isSetupComplete ? 'login.html' : 'setup.html';
    console.log(`Loading initial page: ${initialPage}`);  // Debug log
    mainWindow.loadFile(path.join(__dirname, 'renderer', initialPage))
        .catch(err => console.error(`Failed to load ${initialPage}:`, err));
}

// Run createMainWindow when the app is ready
app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// USB selection dialog handler
ipcMain.on('select-usb', async (event) => {
    console.log('USB selection triggered');  // Debug log
    try {
        const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
        
        if (result.canceled || result.filePaths.length === 0) {
            event.reply('usb-selection-failed', 'No USB selected.');
            return;
        }
        
        const usbPath = result.filePaths[0];
        console.log(`USB selected: ${usbPath}`);  // Debug log
        event.reply('usb-selected', usbPath);
    } catch (error) {
        console.error('Error selecting USB:', error);
        event.reply('usb-selection-failed', 'USB selection failed.');
    }
});

// Set up USB with Python backend and show Continue button
ipcMain.on('setup-usb', (event, usbPath) => {
    console.log(`Setting up USB at path: ${usbPath}`);  // Debug log

    // Using 'python' instead of 'python3' for Windows compatibility
    const python = spawn('python', ['PasswordManager/backend/password_manager.py', 'setup', usbPath]);

    python.stdout.on('data', (data) => {
        const generatedPassword = data.toString().trim();
        console.log(`Setup complete. Generated password: ${generatedPassword}`);  // Debug log
        event.reply('setup-complete', generatedPassword);
        
        // Mark setup as complete in app data
        fs.writeFileSync(APP_DATA_PATH, JSON.stringify({ setupComplete: true }));
    });

    python.stderr.on('data', (data) => {
        console.error(`Setup error from Python: ${data}`);
        event.reply('setup-failed', 'Failed to set up USB.');
    });
});

// Handle transition to the login page when the Continue button is clicked
ipcMain.on('load-login-page', () => {
    mainWindow.loadFile(path.join(__dirname, 'renderer', 'login.html'))
        .catch(err => console.error('Failed to load login.html:', err));
});
