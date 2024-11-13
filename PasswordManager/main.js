const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { db, encryptPassword, decryptPassword } = require('./db');

let win;
let usbPath = null;

// Function to create the main application window
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    // Load the setup.html file using a relative path
    const setupPath = path.join(__dirname, 'setup.html');
    win.loadFile(setupPath).catch(err => {
        console.error('Failed to load setup.html:', err);
    });
}

// Initialize the Electron app
app.whenReady().then(createWindow);

// Quit the app when all windows are closed (for non-macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// ===================== USB AUTHENTICATION HANDLERS ===================== //

// Handle USB drive selection
ipcMain.on('select-usb-drive', async (event) => {
    const result = await dialog.showOpenDialog(win, { properties: ['openDirectory'] });
    if (!result.canceled && result.filePaths.length > 0) {
        usbPath = result.filePaths[0];
        win.webContents.send('usb-selected', usbPath);
    } else {
        win.webContents.send('usb-error', 'No USB drive selected.');
    }
});

// Handle master password initialization
ipcMain.on('initialize-usb', (event, masterPassword) => {
    if (usbPath) {
        const usbFilePath = path.join(usbPath, 'master_password.txt');
        const localFilePath = path.join(__dirname, 'local_master_password.txt');
        const hashedPassword = bcrypt.hashSync(masterPassword, 10);

        try {
            fs.writeFileSync(usbFilePath, hashedPassword, 'utf8');
            fs.writeFileSync(localFilePath, hashedPassword, 'utf8');
            win.webContents.send('setup-complete', 'USB setup complete.');
            win.loadFile(path.join(__dirname, 'index.html'));
        } catch (err) {
            console.error('Error saving master password:', err);
            win.webContents.send('usb-error', 'Failed to save password.');
        }
    } else {
        win.webContents.send('usb-error', 'Please select a USB drive first.');
    }
});

// ===================== AUTHENTICATION HANDLER ===================== //

// Handle user authentication
ipcMain.on('authenticate', () => {
    if (!usbPath) {
        win.webContents.send('auth-response', 'No USB drive selected.');
        return;
    }

    const usbFilePath = path.join(usbPath, 'master_password.txt');
    const localFilePath = path.join(__dirname, 'local_master_password.txt');

    if (fs.existsSync(usbFilePath) && fs.existsSync(localFilePath)) {
        const usbHash = fs.readFileSync(usbFilePath, 'utf8').trim();
        const localHash = fs.readFileSync(localFilePath, 'utf8').trim();

        if (usbHash === localHash) {
            win.loadFile(path.join(__dirname, 'passwordManager.html'));
        } else {
            win.webContents.send('auth-response', 'Login Failed: Passwords do not match.');
        }
    } else {
        win.webContents.send('auth-response', 'Login Failed: Password files not found.');
    }
});

// ===================== CRUD OPERATIONS HANDLERS ===================== //

// Handle adding a new password
ipcMain.on('add-password', (event, { service, username, password }) => {
    const { encrypted, iv } = encryptPassword(password);
    db.run(`INSERT INTO passwords (service, username, encrypted_password, iv) VALUES (?, ?, ?, ?)`,
        [service, username, encrypted, iv], (err) => {
            if (err) {
                event.reply('password-save-failed', 'Failed to save password.');
                return;
            }
            event.reply('password-saved', 'Password saved successfully.');
        });
});

ipcMain.on('get-passwords', (event) => {
    db.all(`SELECT * FROM passwords`, [], (err, rows) => {
        if (err) {
            event.reply('get-passwords-failed', 'Failed to retrieve passwords.');
            return;
        }
        const passwords = rows.map(row => ({
            ...row,
            password: decryptPassword(row.encrypted_password, row.iv)
        }));
        event.reply('passwords-retrieved', passwords);
    });
});

ipcMain.on('delete-password', (event, id) => {
    db.run(`DELETE FROM passwords WHERE id = ?`, [id], (err) => {
        if (err) {
            event.reply('delete-password-failed', 'Failed to delete password.');
            return;
        }
        event.reply('password-deleted', 'Password deleted successfully.');
    });
});
