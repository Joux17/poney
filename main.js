const { app, BrowserWindow, ipcMain } = require('electron')
const { shell } = require('electron');

// Système de reload de l'application après un changement dans le code
if(!app.isPackaged) {
  try {
    require('electron-reloader')(module, {
        debug: true,
        watchRenderer: true
    });
  } catch (_) { console.log('Error !'); }   
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // Permet d'utiliser le ipcMain
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  win.loadFile('index.html');
  // Activation de la console de debug uniquement en dev
  if(!app.isPackaged) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Déclenche l'action quand l'index.js émet l'événement "place-disponible"
ipcMain.on("place-disponible", (event,content) => {
  shell.openExternal(content);
})