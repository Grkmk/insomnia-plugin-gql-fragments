/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { syncSuccessful, getSyncDirOrAsk } from '../sync/ask-folder'
import { flowSync } from '../sync/sync-files'

/**
 * Insomnia, click on folder
 */
export const generateGQLFile = {
  label: 'Sync insomnia to repo gql',
  icon: 'fa-exchange',
  action: async (
    context: any,
    obj: {
      requestGroup: any
      requests: Array<any>
    },
  ): Promise<void> => {
    const folder = await getSyncDirOrAsk(context)
    if (folder) {
      if (await flowSync(context, obj.requestGroup, folder)) syncSuccessful()
      // else syncUnSuccessful()
    }
  },
}
