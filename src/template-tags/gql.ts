/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * GQL TAG for insomnia
 */
import fs from 'fs'
import os from 'os'
export const GQLTag = {
  name: 'gql',
  displayName: 'GQL',
  description: 'read contents from a graphql',
  args: [
    {
      displayName: 'Choose File',
      type: 'file',
    },
  ],
  async run(context: any, path: string): Promise<string> {
    if (!path) {
      throw new Error('No file selected')
    }

    if (!path.startsWith('/') && !path.startsWith('~')) {
      path = context.context.ios_gql_queries + path
    }

    if (path.includes('~')) {
      path = path.replace('~', os.homedir())
    }

    return fs.readFileSync(path, 'utf8')
  },
}
