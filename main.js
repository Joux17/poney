const { app, BrowserWindow } = require("electron");

try {
  require("electron-reloader")(module, {
    debug: true,
    watchRenderer: true,
  });
} catch (_) {
  console.log("Error");
}

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

app.whenReady().then(() => {
  createWindow()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
