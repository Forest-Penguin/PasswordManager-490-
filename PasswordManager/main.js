const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({ webPreferences: { nodeIntegration: true } });
    
    // Start with the setup page to allow USB initialization
    win.loadFile('setup.html');

    // Event listener for USB initialization
    ipcMain.on('initialize-usb', (event, password) => {
        const pythonProcess = spawn('python', ['initialize_usb.py', password]);
        pythonProcess.stdout.on('data', (data) => {
            const response = data.toString().trim();
            event.reply('setup-response', response);

            if (response.includes("USB initialized successfully")) {
                // Load login page after successful USB setup
                win.loadFile('index.html');
            }
        });
    });

    // Event listener for authentication
    ipcMain.on('authenticate', (event, password) => {
        const pythonProcess = spawn('python', ['authenticate.py', password]);
        pythonProcess.stdout.on('data', (data) => {
            const response = data.toString().trim();
            if (response === "Login Successful") {
                // Load the main password manager page after successful login
                win.loadFile('passwordManager.html');
            } else {
                event.reply('auth-response', 'Login Failed');
            }
        });
    });

    ipcMain.on('add-password', (event, data) => {
        const pythonProcess = spawn('python', ['add_password.py', data.service, data.username, data.password]);
        pythonProcess.stdout.on('data', (data) => {
            console.log(`Password saved: ${data}`);
        });
    });
    
}

app.whenReady().then(createWindow);
