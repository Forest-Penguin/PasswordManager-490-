const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const setupFilePath = path.join(app.getPath('userData'), 'setup.json');
const USB_TIMEOUT_MS = 10000; // Timeout after 10 seconds

function isSetupCompleted() {
    if (fs.existsSync(setupFilePath)) {
        const setupData = JSON.parse(fs.readFileSync(setupFilePath, 'utf-8'));
        return setupData && setupData.isSetupCompleted;
    }
    return false;
}

function saveSetupCompletion() {
    fs.writeFileSync(setupFilePath, JSON.stringify({ isSetupCompleted: true }));
}

function createWindow() {
    const win = new BrowserWindow({ webPreferences: { nodeIntegration: true, contextIsolation: false } });

    if (!isSetupCompleted()) {
        win.loadFile(path.join(__dirname, 'setup.html'));
    } else {
        win.loadFile(path.join(__dirname, 'index.html'));
    }

    // Handle USB initialization with timeout
    ipcMain.on('initialize-usb', (event, password) => {
        const pythonProcess = spawn('python', ['initialize_usb.py', password]);

        let isUSBChecked = false;

        const timeout = setTimeout(() => {
            if (!isUSBChecked) {
                pythonProcess.kill(); // Terminate the process if it hangs
                event.reply('setup-response', 'USB initialization timed out. Please try again.');
            }
        }, USB_TIMEOUT_MS);

        pythonProcess.stdout.on('data', (data) => {
            clearTimeout(timeout); // Clear the timeout if data is received
            isUSBChecked = true;
            const response = data.toString().trim();
            event.reply('setup-response', response);

            if (response.includes("USB initialized successfully")) {
                saveSetupCompletion();
                win.loadFile(path.join(__dirname, 'index.html'));
            }
        });

        pythonProcess.on('error', (error) => {
            clearTimeout(timeout);
            event.reply('setup-response', `USB initialization failed: ${error.message}`);
        });
    });

    // Handle login
    ipcMain.on('authenticate', (event, password) => {
        const pythonProcess = spawn('python', ['authenticate.py', password]);
        pythonProcess.stdout.on('data', (data) => {
            const response = data.toString().trim();
            if (response === "Login Successful") {
                win.loadFile(path.join(__dirname, 'passwordManager.html'));
            } else {
                event.reply('auth-response', 'Login Failed');
            }
        });
    });

    // Handle adding passwords
    ipcMain.on('add-password', (event, data) => {
        const pythonProcess = spawn('python', ['add_password.py', data.service, data.username, data.password]);
        pythonProcess.stdout.on('data', (data) => {
            console.log(`Password saved: ${data}`);
        });
    });
}

app.whenReady().then(createWindow);
