import * as electron from 'electron'
import { RequestHookContext } from '../insomnia/types/request-hook-context'

/** The Storage key for the foldes */
const KEY = 'path-export-folder'

/**
 * Ask the use for the folder where gql queries are.
 * @param _context
 */
export const askFolderDirectory = async (context: RequestHookContext): Promise<string | null> => {
  // await _context.app.showSaveDialog({})
  const msgOptions: Electron.MessageBoxOptions = {
    message: 'Sync export insomnia queries/mutation (body) to gql file',
    type: 'info',
    title: 'Sync Gql to files',
    detail:
      'The insomnia request folder you sectioned, will be exported into .graphql files into the folder you pick.\nFolder hierarchy will be kept to match Insomnia request folder.',
  }
  await electron.remote.dialog.showMessageBox(msgOptions)
  const openOptions: Electron.OpenDialogOptions = {
    title: 'Choose the root folder for the sync',
    buttonLabel: 'Choose',
    properties: ['openDirectory'],
    message: 'Choose the root folder, ie ~/sites/automation-poc/',
  }
  const { filePaths } = await electron.remote.dialog.showOpenDialog(openOptions)
  if (filePaths && filePaths[0]) {
    await context.store.setItem(KEY, filePaths[0])
    return filePaths[0]
  }

  return null
}

/**
 * Get cache key
 * @param context
 * @returns
 */
const getSyncDirectory = async (context: RequestHookContext): Promise<string | null> => {
  return await context.store.getItem(KEY)
}

/**
 * Get cached directory path or Ask for it.
 * @param context
 * @returns
 */
export const getSyncDirOrAsk = async (context: RequestHookContext): Promise<string | null> => {
  const folder = await getSyncDirectory(context)
  if (folder) return folder
  return await askFolderDirectory(context)
}

/**
 * Ask the use for the folder where gql queries are.
 * @param _context
 */
export const syncSuccessful = async (): Promise<void> => {
  const msgOptions: Electron.MessageBoxOptions = {
    message: 'Sync successful.',
    type: 'info',
    title: 'Sync Gql to files',
    detail: '',
  }
  await electron.remote.dialog.showMessageBox(msgOptions)
}

/**
 * Ask the use for the folder where gql queries are.
 * @param _context
 */
export const syncUnSuccessful = async (): Promise<void> => {
  const msgOptions: Electron.MessageBoxOptions = {
    message: 'Sync unsuccessful.',
    type: 'warning',
    title: 'Sync Gql to files',
    detail: '',
  }
  await electron.remote.dialog.showMessageBox(msgOptions)
}
