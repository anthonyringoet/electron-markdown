const path = require('path')
const fs = require('fs')
const {app, BrowserWindow, dialog, Menu} = require('electron')
let mainWindow = null

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open...',
        accelerator: 'CmdOrCtrl+O',
        click () { openFile() }
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click () { saveFile() }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  },
  {
    label: 'Developer',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin'
          ? 'Alt+Command+I'
          : 'Ctrl+Shift+I',
        click () { mainWindow.webContents.toggleDevTools() }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click () { app.quit() }
      }
    ]
  })
}

app.on('ready', () => {
  console.log('The application is ready.')

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })
  mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'))

  // mainWindow.webContents.openDevTools()
  // mainWindow.webContents.on('did-finish-load', () => {
  //   openFile()
  // })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

app.on('window-all-closed', () => {
  console.log('window all closed')
  app.quit()
})

app.on('open-file', (event, file) => {
  const content = fs.readFileSync(file).toString()
  mainWindow.webContents.send('file-opened', file, content)
})

function openFile () {
  const files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown files', extensions: ['md', 'markdown', 'txt'] }
    ]
  })

  if (!files) return

  const file = files[0]
  const content = fs.readFileSync(file).toString()
  app.addRecentDocument(file)

  // console.log(content)
  // send to renderer process
  mainWindow.webContents.send('file-opened', file, content)
}

function saveFile (content) {
  const fileName = dialog.showSaveDialog(mainWindow, {
    title: 'Save HTML output',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'HTML Files', extensions: ['html'] }
    ]
  })

  if (!fileName) return

  fs.writeFileSync(fileName, content)
}

exports.openFile = openFile
exports.saveFile = saveFile
