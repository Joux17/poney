const { app, BrowserWindow } = require("electron");

try {
  require("electron-reloader")(module, {
    debug: true,
    watchRenderer: true,
  });
} catch (_) {
  console.log("Error");
}

// Quand l'application est prête, crée la fenêtre de l'application
app.whenReady().then(() => {
  createWindow()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("index.html"); // Charge le fichier index.html au démarrage de l'application
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
};
