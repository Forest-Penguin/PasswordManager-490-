const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({ webPreferences: { nodeIntegration: true } });
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Listen for login attempts
ipcMain.on('authenticate', (event, password) => {
    const pythonProcess = spawn('python', ['authenticate.py', password]);
    pythonProcess.stdout.on('data', (data) => {
        event.reply('auth-response', data.toString());
    });
});
