/* eslint-disable @typescript-eslint/no-explicit-any */
enum InsomniaExportResourceType {
  FOLDER = 'request_group',
  REQUEST = 'request',
  // Anything else like unit tests but not needed
}

interface InsomniaExport {
  resources: {
    _id: string
    parentId: string
    name: string
    description: string
    _type: InsomniaExportResourceType
  }[]
}

const folderSelected = (folderSelected: string, _json: InsomniaExport) => {
  console.log('folder: ' + folderSelected)
}

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

export const exportGQL = {
  label: 'Export Gql queries ...',
  icon: 'fa-exchange',
  action: async (context: unknown, models: unknown): Promise<void> => exportGqlQueries(context, models),
}
