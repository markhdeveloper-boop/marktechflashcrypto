const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // wait a bit for server to be ready
  setTimeout(() => {
    win.loadURL("http://localhost:5000/app");
  }, 1000);

  win.webContents.openDevTools(); // helps you see errors
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});