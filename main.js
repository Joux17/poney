const { app, BrowserWindow, dialog, ipcMain, Notification, shell } = require("electron");
const nodemailer = require("nodemailer");
require("dotenv").config();

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

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

// Déclenche l'action quand le renderer.js émet l'événement "place-disponible"
ipcMain.on("place-disponible", (_, url, numeroEpreuve, navigateurActivee) => {
	if(navigateurActivee) {
		ouvrirDansLeNavigateur(url);
	}
	envoiMail(url, numeroEpreuve);
});

ipcMain.on("ouvrir-avertissement", (_, message) => {
	ouvrirFenetreAvertissement(message);
});

ipcMain.on("notification-bureau", (_, concours, numeroEpreuveSouhaitee, url) => {
	const NOTIFICATION_TITLE = `Concours Poney ${concours}`;
    const NOTIFICATION_BODY = `Place disponible pour l'épreuve ${numeroEpreuveSouhaitee}`;
    const notification = new Notification({
		title: NOTIFICATION_TITLE, 
		body: NOTIFICATION_BODY, 
		icon: "./poney.ico" 
	});

	notification.show();

    notification.on("click",(_) => {
        ouvrirDansLeNavigateur(url);
    });
})

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

function ouvrirFenetreAvertissement(message) {
	dialog.showMessageBox({
		type: "warning",
		buttons: [],
		title: "Avertissement",
		message,
	});
}

function ouvrirDansLeNavigateur(url) {
	shell.openExternal(url); // Ouvre l'url dans un navigateur
}