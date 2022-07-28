import { GQL } from './insomnia/types/GQL'
import { Body } from './insomnia/types/request-context'

/**
 * Make JSON "pretty" and return it as GQL Obl
 * @param query
 * @returns
 */
export const filterJsonAndTestGQL = (query: Body): GQL | null => {
  if (query.mimeType === 'application/graphql') {
    const formatJson = query.text
      .replace(/(\r\n|\n|\r)/gm, ' ')
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/\t/g, ' ')

    return JSON.parse(formatJson) as GQL
  }
  return null
}

/**
 * Remove fragment and other insomnia non required stuff for files
 * @param gql
 * @returns
 */
export const filterGQL = (gql: GQL): string => {
  return gql.query.replace(/{%.*%}/g, '').trim() + '\n'
}
