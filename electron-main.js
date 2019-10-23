const { app, BrowserWindow } = require('electron');

app.on('ready', () => {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        darkTheme: true,
        center: true,
        title: "LoL Pick&Ban UI Admin by RCV"
    });

    // and load the index.html of the app.
    win.loadFile('admin/index.html');
});
