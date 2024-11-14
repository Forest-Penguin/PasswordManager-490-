// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectUSB: () => ipcRenderer.send('select-usb'),
    onUSBSelected: (callback) => ipcRenderer.on('usb-selected', (event, usbPath) => callback(usbPath)),
    onUSBSelectionFailed: (callback) => ipcRenderer.on('usb-selection-failed', (event, message) => callback(message)),
    setupUSB: (usbPath) => ipcRenderer.send('setup-usb', usbPath),
    onSetupComplete: (callback) => ipcRenderer.on('setup-complete', (event, password) => callback(password)),
    onSetupFailed: (callback) => ipcRenderer.on('setup-failed', (event, message) => callback(message)),
    loadLoginPage: () => ipcRenderer.send('load-login-page')
});
