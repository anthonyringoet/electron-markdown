const path = require('path')
const fs = require('fs')
const {app, BrowserWindow, dialog} = require('electron')
let mainWindow = null

app.on('ready', () => {
  console.log('The application is ready.')

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })
  mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'))

  mainWindow.webContents.on('did-finish-load', () => {
    openFile()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

app.on('window-all-closed', () => {
  console.log('window all closed')
  app.quit()
})

function openFile () {
  const files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    buttonLabel: 'Open these beautiful files',
    filters: [
      { name: 'Markdown files', extensions: ['md', 'markdown', 'txt'] }
    ]
  })

  if (!files) return

  const file = files[0]
  const content = fs.readFileSync(file).toString()

  console.log(files)
  console.log(content)

  // send to renderer process
  mainWindow.webContents.send('file-opened', file, content)
}
