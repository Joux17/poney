const { app, BrowserWindow, dialog, ipcMain, shell } = require("electron");
const {} = require("electron");
const nodemailer = require("nodemailer");
require("dotenv").config();

function envoiMail(url, numeroEpreuve) {
	if(process.env.DESTINATAIRE == undefined) {
		ouvrirFenetreAvertissement("Aucun destinataire n'a été défini.")
		return;
	}
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.USER,
			pass: process.env.TOKEN,
		},
	});

	const mailOptions = {
		from: process.env.EMETTEUR,
		to: process.env.DESTINATAIRE,
		subject: `Concours Poney - Épreuve ${numeroEpreuve}`,
		text: `Place de libre pour le concours ${url}`,
	};

	transporter.sendMail(mailOptions, function (err, info) {
		if (err) console.log(err);
		else console.log(info);
	});
}

// Système de reload de l'application après un changement dans le code
if (!app.isPackaged) {
  try {
    require("electron-reloader")(module, {
      debug: true,
      watchRenderer: true,
    });
  } catch (_) {
    console.log("Error !");
  }
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
	});

	win.loadFile("index.html");
	// Activation de la console de debug uniquement en dev
	if (!app.isPackaged) {
		win.webContents.openDevTools({
			mode: "right",
		});
	}
};

app.whenReady().then(() => {
	createWindow();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

// Déclenche l'action quand le renderer.js émet l'événement "place-disponible"
ipcMain.on("place-disponible", (_, url, numeroEpreuve) => {
	shell.openExternal(url);
	envoiMail(url, numeroEpreuve);
});

ipcMain.on("ouvrir-avertissement", (_, message) => {
	ouvrirFenetreAvertissement(message);
});

function ouvrirFenetreAvertissement(message) {
	dialog.showMessageBox({
		type: "warning",
		buttons: [],
		title: "Avertissement",
		message,
	});
}
