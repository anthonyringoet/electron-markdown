const electron = require('electron')
const ipc = electron.ipcRenderer
const {remote, shell} = electron
const {clipboard} = remote
const mainProcess = remote.require('./main')
const marked = require('marked')
const dragDrop = require('drag-drop')
let currentFile = null

// DOM
const $ = require('jquery')
const $markdownView = $('.raw-markdown')
const $htmlView = $('.rendered-html')
const $openFileButton = $('#open-file')
const $saveFileButton = $('#save-file')
const $copyHtmlButton = $('#copy-html')
const $showInFileSystemButton = $('#show-in-file-system')
const $openInDefaultEditorButton = $('#open-in-default-editor')

ipc.on('file-opened', (event, file, content) => {
  currentFile = file

  $showInFileSystemButton.attr('disabled', false)
  $openInDefaultEditorButton.attr('disabled', false)

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

$copyHtmlButton.on('click', () => {
  const html = $htmlView.html()
  clipboard.writeText(html)
})

$saveFileButton.on('click', () => {
  const html = $htmlView.html()
  mainProcess.saveFile(html)
})

$showInFileSystemButton.on('click', () => {
  shell.showItemInFolder(currentFile)
})

$openInDefaultEditorButton.on('click', () => {
  shell.openItem(currentFile)
})

$(document).on('click', 'a[href^="http"]', (event) => {
  event.preventDefault()
  shell.openExternal(event.target.href)
})

$(document).ready(function () {
  console.log('ready')

  // drag drop
  dragDrop(document.body, function (files, pos) {
    console.log('Here are the dropped files', files)
    console.log('Dropped at coordinates', pos.x, pos.y)
  })
})
