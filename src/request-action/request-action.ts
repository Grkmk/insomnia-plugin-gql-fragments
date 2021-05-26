/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestAction } from '../insomnia/types/request-action'
import { RequestHookContext } from '../insomnia/types/request-hook-context'
import { getSyncDirOrAsk, syncSuccessful } from '../sync/ask-folder'
import { flowSync } from '../sync/sync-files'

export const generateSingleGQLFile = {
  label: 'Sync insomnia to repo gql',
  icon: 'fa-exchange',
  action: async (context: RequestHookContext, obj: any): Promise<void> => {
    const folder = await getSyncDirOrAsk(context)
    if (folder) {
      if (await flowSync(context, obj.request, folder)) syncSuccessful()
      // else syncUnSuccessful()
    }
  },
}
/**
 * Insomnia UI ActionRequest
 */
export const generateReqID: RequestAction = {
  label: 'Fragment: getReqId code',
  icon: 'fa-copy',

  action: async (context, obj) => {
    displayReqID(context, obj.request._id)
  },
}

/**
 * Display code for extension with frag and proper formatting
 * @param context
 * @param reqId
 */
const displayReqID = async (context: any, reqId: string) => {
  const body = document.createElement('div')
  body.innerHTML = getHTML(`{% fragment '${reqId}' %}`)
  await context.app.dialog('Copy this fragment url to the request', body, {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onHide: () => {},
  })
}

/**
 * Get popup HTML Code
 * @param code
 * @returns
 */
const getHTML = (code: string): string => {
  return `
  <div class="border-top editor" style="height: 120px; width: 100%; padding-top: 30px; padding-left: 15px;">
    <div class="editor__container input border-top" style="font-size: 12px;">
      <textarea autocomplete="off" style="height: 120px; width: 100%"> ${code}</textarea>
    </div>
  </div>
  `
}
