const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');

let win;
let usbPath = null;

function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    
    win.loadFile(path.join(__dirname, 'setup.html'));

    ipcMain.on('select-usb-drive', async () => {
        const result = await dialog.showOpenDialog(win, {
            properties: ['openDirectory']
        });
        if (!result.canceled && result.filePaths.length > 0) {
            usbPath = result.filePaths[0];
            win.webContents.send('usb-selected', usbPath);
        } else {
            win.webContents.send('usb-error', 'No USB drive selected.');
        }
    });

    ipcMain.on('initialize-usb', (event, masterPassword) => {
        if (usbPath) {
            const usbFilePath = path.join(usbPath, 'master_password.txt');
            const localFilePath = path.join(__dirname, 'local_master_password.txt');
            const saltRounds = 10;
            const hashedPassword = bcrypt.hashSync(masterPassword, saltRounds);
            
            fs.writeFileSync(usbFilePath, hashedPassword, 'utf8'); // Save to USB
            fs.writeFileSync(localFilePath, hashedPassword, 'utf8'); // Save locally
            win.webContents.send('setup-complete', 'USB setup complete. Redirecting to login...');
        } else {
            win.webContents.send('usb-error', 'Please select a USB drive first.');
        }
    });

    ipcMain.on('load-login-page', () => {
        win.loadFile(path.join(__dirname, 'index.html'));
    });

    ipcMain.on('authenticate', () => {
        if (usbPath) {
            const usbFilePath = path.join(usbPath, 'master_password.txt');
            const localFilePath = path.join(__dirname, 'local_master_password.txt');

            if (fs.existsSync(usbFilePath) && fs.existsSync(localFilePath)) {
                const usbHashedPassword = fs.readFileSync(usbFilePath, 'utf8').trim();
                const localHashedPassword = fs.readFileSync(localFilePath, 'utf8').trim();

                if (usbHashedPassword === localHashedPassword) {
                    win.loadFile(path.join(__dirname, 'passwordManager.html')); // Redirect to main page
                } else {
                    win.webContents.send('auth-response', 'Login Failed: Passwords do not match');
                }
            } else {
                win.webContents.send('auth-response', 'Login Failed: master_password.txt not found on USB or locally.');
            }
        } else {
            win.webContents.send('auth-response', 'Please select a USB drive first.');
        }
    });

    ipcMain.on('add-password', (event, data) => {
        if (usbPath) {
            const addPasswordScript = path.join(__dirname, 'add_password.py');
            const pythonProcess = spawn('python', [addPasswordScript, data.service, data.username, data.password]);
            pythonProcess.stdout.on('data', (data) => {
                console.log(`Password saved: ${data}`);
                event.reply('password-saved', 'Password saved successfully.');
            });
            pythonProcess.stderr.on('data', (data) => {
                console.error(`Error: ${data.toString()}`);
                event.reply('password-save-failed', 'Failed to save password.');
            });
        } else {
            event.reply('auth-response', 'USB path not selected.');
        }
    });
}

app.whenReady().then(createWindow);
