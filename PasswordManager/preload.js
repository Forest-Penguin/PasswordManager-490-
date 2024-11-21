const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // USB selection for setup and login
    selectUSB: () => ipcRenderer.send('select-usb'),
    onUSBSelected: (callback) => ipcRenderer.on('usb-selected', (event, usbPath) => callback(usbPath)),
    onUSBSelectionFailed: (callback) => ipcRenderer.on('usb-selection-failed', (event, message) => callback(message)),
    
    // Setup process for generating and saving the USB password
    setupUSB: (usbPath) => ipcRenderer.send('setup-usb', usbPath),
    onSetupComplete: (callback) => ipcRenderer.on('setup-complete', (event, password) => callback(password)),
    onSetupFailed: (callback) => ipcRenderer.on('setup-failed', (event, message) => callback(message)),
    loadLoginPage: () => ipcRenderer.send('load-login-page'),
    
    // Verification process for login
    verifyUSB: (usbPath) => ipcRenderer.send('verify-usb', usbPath),
    onLoginSuccess: (callback) => ipcRenderer.on('login-success', callback),
    onLoginFailed: (callback) => ipcRenderer.on('login-failed', (event, message) => callback(message)),

    // Password Manager Functions
    fetchPasswords: (callback) => ipcRenderer.invoke('fetch-passwords').then(callback),
    addPassword: (passwordData) => ipcRenderer.send('add-password', passwordData),
    editPassword: (updateData) => ipcRenderer.send('edit-password', updateData),
    deletePassword: (id) => ipcRenderer.send('delete-password', id),
    generatePassword: (callback) => ipcRenderer.invoke('generate-password').then(callback),
    onPasswordChange: (callback) => ipcRenderer.on('password-changed', callback),

    // Check if a password has been pwned
    checkPasswordPwned: (password) => ipcRenderer.invoke('check-password-pwned', password)
});
