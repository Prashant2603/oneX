const { app, BrowserWindow, Menu, MenuItem, dialog } = require('electron')
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
const { ipcMain } = require('electron')


ipcMain.on('file-save', (event, arg) => {
    saveFile(arg);
})

function saveFile(content) {
    dialog.showSaveDialog((fileName) => {
        if (fileName === undefined) {
            console.log("You didn't save the file");
            return;
        }

        // fileName is a string that contains the path and filename created in the save file dialog.  
        fs.writeFile(fileName, content, (err) => {
            if (err) {
                alert("An error ocurred creating the file " + err.message)
            }

            win.webContents.send('file-saved', fileName);
            console.log("The file has been succesfully saved");
        });
    });
}
var win;
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600 })

    // and load the index.html of the app.
    win.loadFile('dist/onex/index.html');
}

function onFileSelect(fileNames) {
    if (fileNames === undefined) {
        console.log("No file selected");
        return;
    }

    fs.readFile(fileNames[0], (err, data) => {
        if (err) {
            alert("An error ocurred reading the file :" + err.message);
            return;
        } else {
            console.log(data.toString());
        }

        // Change how to handle the file content
        //    console.log("The file content is : " + data);

        win.webContents.send('file-open', { name: fileNames[0], content: data.toString() });


    });
}
var showOpen = function () {
    dialog.showOpenDialog({
        properties: ['openFile'], filters: [], callback: function (fileNames) {
            console.log(fileNames);
        }
    });
};
const template = [
    {
        label: 'File',
        submenu: [{
            label: 'New',

            role: 'new',
            accelerator: 'CommandOrControl+N',
            click() {
                win.webContents.send('file-new', 'new');
            }
        },
        {
            label: 'Open',

            role: 'open',
            accelerator: 'CommandOrControl+O',
            click() {
                dialog.showOpenDialog({
                    properties: ['openFile', 'multiSelections']
                }, function (files) {
                    if (files !== undefined) {
                        console.log("uploaded...");
                        onFileSelect(files);     // ent.open(proj);

                    }

                });
            }
        },
        {
            label: 'Save',

            role: 'save',
            accelerator: 'CommandOrControl+S',
            click() {
                win.webContents.send('file-save-request', 'save');
            }
        }]
    },
    {
        label: 'Edit',
        submenu: [
            {
                role: 'undo',

            },
            {
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                role: 'cut'
            },
            {
                role: 'copy'
            },
            {
                role: 'paste'
            },
            {
                role: 'pasteandmatchstyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectall'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                role: 'reload'
            },
            {
                role: 'forcereload'
            },
            {
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'window',
        submenu: [
            {
                role: 'minimize'
            },
            {
                role: 'close'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() {
                    require('electron').shell.openExternal('https://electronjs.org')
                }
            }
        ]
    }
]


if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            {
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    })

    // Edit menu
    template[2].submenu.push({
        type: 'separator'
    }, {
            label: 'Speech',
            submenu: [
                {
                    role: 'startspeaking'
                },
                {
                    role: 'stopspeaking'
                }
            ]
        })

    // Window menu
    template[4].submenu = [
        {
            role: 'close'
        },
        {
            role: 'minimize'
        },
        {
            role: 'zoom'
        },
        {
            type: 'separator'
        },
        {
            role: 'front'
        }
    ]
}
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.on('ready', createWindow)