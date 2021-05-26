import { RequestHookContext } from '../insomnia/types/request-hook-context'
import { askFolderDirectory } from '../sync/ask-folder'
import { InsomniaExport, InsomniaExportResourceType } from '../sync/export-inso'

export const exportGQL = {
  label: 'Export Gql queries ...',
  icon: 'fa-exchange',
  action: async (context: unknown, models: unknown): Promise<void> => exportGqlQueries(context, models),
}

export const changeSyncFolder = {
  label: 'Update Sync Folder',
  icon: 'fa-exchange',
  action: async (context: RequestHookContext, _models: unknown): Promise<string | null> => await askFolderDirectory(context),
}

/** OLD Folder Selection to export GQL from Insomnia Workspace*/
const folderSelected = (folderSelected: string, _json: InsomniaExport) => {
  console.log('folder: ' + folderSelected)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const exportGqlQueries = async (context: any, models: any) => {
  const exportJson = await context.data.export.insomnia({
    includePrivate: false,
    format: 'json',
    workspace: models.workspace,
  })
  const json = JSON.parse(exportJson) as InsomniaExport
  const folders = json.resources
    .filter(resource => resource._type === InsomniaExportResourceType.FOLDER)
    .filter(resource => !resource.parentId.startsWith('fld_'))

  const body = document.createElement('div')
  body.innerHTML = `<label for="folder">Choose a folder:</label>

  <select name="folder" id="folders">
    ${folders.map(folder => `<option value="${folder.name}">${folder.name}</option>`).join('\n')}
  </select>`
  console.log(body.innerHTML)
  await context.app.dialog('Pick a folder to export: ', body, {
    onHide: () => {
      const e = document.getElementById('folders') as HTMLOptionElement
      console.log(context)
      folderSelected(e.value, json)
    },
  })
}
