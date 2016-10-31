const electron = require('electron')
const ipc = electron.ipcRenderer
const {remote} = electron
const mainProcess = remote.require('./main')
const marked = require('marked')

// DOM
const $ = require('jquery')
const $markdownView = $('.raw-markdown')
const $htmlView = $('.rendered-html')
const $openFileButton = $('#open-file')
const $saveFileButton = $('#save-file')
const $copyHtmlButton = $('#copy-html')

ipc.on('file-opened', (event, file, content) => {
  $markdownView.val(content)
  renderMarkdownToHtml(content)
})

function renderMarkdownToHtml (markdown) {
  const html = marked(markdown)
  $htmlView.html(html)
}

$markdownView.on('keyup', (event) => {
  const content = $(event.target).val()
  renderMarkdownToHtml(content)
})

$openFileButton.on('click', () => {
  mainProcess.openFile()
})
