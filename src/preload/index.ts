import { contextBridge, ipcRenderer, SaveDialogOptions } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// Custom APIs for renderer

const api = {
  showSaveDialog: (content: string, options: SaveDialogOptions) =>
    ipcRenderer.invoke('dialog:saveDialog', content, options).then((value) => value),
  checkDBConnection: (databaseProperties: DatabaseProperties) => {
    return ipcRenderer.invoke('checkDatabaseConnection', databaseProperties)
  },
  insertReportIntoDB: (databaseProperties: DatabaseProperties, report: ReportResult) => {
    return ipcRenderer
      .invoke('insertReportIntoDB', databaseProperties, report)
      .catch((err) => console.log(err))
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
