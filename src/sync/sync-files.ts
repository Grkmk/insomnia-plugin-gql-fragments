import fs from 'fs'
import * as electron from 'electron'
import { RequestHookContext } from '../insomnia/types/request-hook-context'
import { InsomniaExport, InsomniaExportResource, InsomniaExportResourceType } from './export-inso'
import { filterGQL, filterJsonAndTestGQL } from '../util'

const INSOMNIA_WORKSPACE = 'wrk_'

const writeFile = async (map: Map<string, InsomniaExportResource[]>, rootFolder: string): Promise<void> => {
  map.forEach((array, path) => {
    const fullPath = rootFolder + path + '/'
    fs.mkdir(fullPath, { recursive: true }, () => {
      array.forEach(async req => {
        const gql = filterJsonAndTestGQL(req.body)
        if (gql) await fs.writeFileSync(fullPath + req.name + '.graphql', filterGQL(gql))
      })
    })
  })
}
// await fs.mkdir(item + '/whatever3/', { recursive: true }, () => {
//   fs.writeFileSync(item + '/whatever3/test2.txt', 'utf8')
//   fs.writeFileSync(item + '/whatever3/test3.txt', 'utf8')
//   fs.writeFileSync(item + '/whatever/test2.txt', 'utf8')
//   fs.writeFileSync(item + '/whatever/test3.txt', 'utf8')
// })

const buildParentPath = (resources: InsomniaExportResource[], resource: InsomniaExportResource): string => {
  let path = `/${resource?.name}`
  while (!resource.parentId.startsWith(INSOMNIA_WORKSPACE)) {
    resource = resources.filter(res => res._id === resource.parentId).pop() as InsomniaExportResource
    path = `/${resource.name}${path}`
  }
  return path
}

const findChildrenRequest = (resources: InsomniaExportResource[], requestGroup: InsomniaExportResource): InsomniaExportResource[] => {
  return resources.filter(res => res.parentId === requestGroup._id).filter(res => res._type === InsomniaExportResourceType.REQUEST)
}

const findChildrenFolder = (resources: InsomniaExportResource[], requestGroup: InsomniaExportResource): InsomniaExportResource[] => {
  return resources.filter(res => res.parentId === requestGroup._id).filter(res => res._type === InsomniaExportResourceType.FOLDER)
}

/**
 * Build the map each folder associated to a path and each query inside an array
 * @param current
 * @param currentPath
 * @param currentMap
 * @param resources
 * @returns
 */
const buildMap = (
  current: InsomniaExportResource,
  currentPath: string,
  currentMap: Map<string, InsomniaExportResource[]>,
  resources: InsomniaExportResource[],
) => {
  const childrenRequests = findChildrenRequest(resources, current)
  const childrenFolders = findChildrenFolder(resources, current)

  childrenRequests.forEach(req => currentMap.set(currentPath, [...(currentMap.get(currentPath) || []), req]))
  childrenFolders.forEach(folder => buildMap(folder, `${currentPath}/${folder.name}`, currentMap, resources))

  return currentMap
}

const exportGqlQueries = async (context: RequestHookContext, requestGroup: InsomniaExportResource, rootFolder: string) => {
  const exportJson = await context.data.export.insomnia({
    includePrivate: false,
    format: 'json',
    // workspace: models.workspace,
  })
  const json = JSON.parse(exportJson) as InsomniaExport

  const path = buildParentPath(json.resources, requestGroup)
  console.log(path)

  const fileMap = new Map<string, InsomniaExportResource[]>()
  const result = buildMap(requestGroup, path, fileMap, json.resources)
  await writeFile(result, rootFolder)
}

const askConfirmation = async (name: string): Promise<boolean> => {
  // await _context.app.showSaveDialog({})
  const msgOptions: Electron.MessageBoxOptions = {
    message: `Are you sure to export folder: "${name}" to files`,
    type: 'question',
    buttons: ['Yes', 'No'],
    title: 'Sync Gql to files',
    detail: 'Files will be written in the directory you selected.\nFolder hierarchy will be kept to match Insomnia request folder.',
  }
  const response = await electron.remote.dialog.showMessageBox(msgOptions)
  // response.response === 0 => clicked on yes button
  return response.response === 0
}

export const flowSync = async (context: RequestHookContext, requestGroup: InsomniaExportResource, folderPath: string): Promise<boolean> => {
  const goAhead = await askConfirmation(requestGroup.name)
  if (!goAhead) return false
  try {
    await exportGqlQueries(context, requestGroup, folderPath)
  } catch (e) {
    return false
  }

  return true
}
