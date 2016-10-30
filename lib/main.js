const path = require('path')
const {app, BrowserWindow} = require('electron')
let mainWindow = null

app.on('ready', () => {
  console.log('The application is ready.')

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })
  mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'))
  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

app.on('window-all-closed', () => {
  console.log('window all closed')
  app.quit()
})
