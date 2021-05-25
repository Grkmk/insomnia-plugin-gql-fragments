/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * FRAG TAG for INSOMNIA
 */
import { parse } from 'graphql'
import { filterJsonAndTestGQL } from '../util'

export const FragTag = {
  name: 'fragment',
  displayName: 'Fragment',
  description: 'Get GQL Fragment body from another request body',
  args: [
    {
      displayName: 'Request',
      type: 'model',
      model: 'Request',
    },
  ],
  async run(context: any, requestID: string): Promise<string> {
    try {
      const request = await context.util.models.request.getById(requestID)
      const queryGql = filterJsonAndTestGQL(request.body)
      if (!queryGql) return 'fragment isNotaGQL on Fragment { id}'
      // try to parsing it to find any errors
      parse(queryGql.query)

      return queryGql.query
    } catch (e) {
      return 'fragment invalidGQL on Fragment { id }'
    }
  },
}
