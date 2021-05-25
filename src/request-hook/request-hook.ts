import { RequestHook } from '../insomnia/types/request-hook'
import { RequestHookContext } from '../insomnia/types/request-hook-context'
import { print } from 'graphql/language/printer'
import { DefinitionNode, parse, SelectionNode } from 'graphql'
import { filterJsonAndTestGQL } from '../util'

/**
 * Remove Duplicates fragment from query
 * @param query
 * @returns
 */
const removeDuplicateFragments = (query: string): string => {
  const ast = parse(query)
  const seen: string[] = []

  const newDefinitions = ast.definitions.filter(def => {
    if (def.kind !== 'FragmentDefinition') {
      return true
    }

    const id = `${def.name.value}-${def.typeCondition.name.value}`
    const haveSeen = seen.includes(id)

    seen.push(id)
    return !haveSeen
  })

  const newAst = {
    ...ast,
    definitions: newDefinitions,
  }

  return print(newAst)
}

/**
 * Find fragment spreads inside a selectionNode of a GQL document
 * @param selections
 * @param found
 * @returns
 */
const findFragSpreads = (selections: ReadonlyArray<SelectionNode>, found: string[]): string[] => {
  selections.forEach(selection => {
    if (selection.kind === 'FragmentSpread') {
      if (selection.name.kind === 'Name') {
        found.push(selection.name.value)
      }
    }
    if (selection.kind === 'Field' || selection.kind === 'InlineFragment') {
      if (selection.selectionSet) {
        findFragSpreads(selection.selectionSet.selections, found)
      }
    }
  })

  return found
}

/**
 * Inside definition node are Fragment Spread, find them from a starting fragmentName defined in the doc.
 * @param fragmentName
 * @param definitions
 * @param found
 * @returns
 */
const findRelSeg = (fragmentName: string, definitions: ReadonlyArray<DefinitionNode>, found: string[]): string[] => {
  let fragmentSpreadsFound: string[] = []
  definitions.forEach(def => {
    if (def.kind === 'FragmentDefinition' && def.selectionSet && def.name.value === fragmentName) {
      fragmentSpreadsFound = findFragSpreads(def.selectionSet.selections, [])
    }
  })

  fragmentSpreadsFound.forEach(frag => {
    found.push(frag)
    findRelSeg(frag, definitions, found)
  })

  return found
}

/**
 * Removed unused Fragments. Parse document then remove any fragment that is not used in the query or by any other fragment.
 * @param query
 * @returns
 */
const removeUnusedFragments = (query: string): string => {
  const ast = parse(query)
  let fragmentInOperation: string[] = []

  ast.definitions.forEach(def => {
    if (def.kind === 'OperationDefinition') if (def.selectionSet) fragmentInOperation = findFragSpreads(def.selectionSet.selections, [])
  })

  console.log('Fragments found in the query:')
  console.log(fragmentInOperation)

  const fragsRequired = new Set<string>()
  fragmentInOperation.forEach(frag => {
    findRelSeg(frag, ast.definitions, [frag]).forEach(seg => fragsRequired.add(seg))
  })

  console.log('Fragment required to keep:')
  console.log(fragsRequired)

  const arrayFragsRequired = [...fragsRequired]
  const newDefinitions = ast.definitions.filter(def => {
    if (def.kind !== 'FragmentDefinition') return true

    if (arrayFragsRequired.includes(def.name.value)) return true
  })

  const newAst = {
    ...ast,
    definitions: newDefinitions,
  }

  return print(newAst)
}

/**
 * Main Insomnia function.
 * Parse request, convert it in json then gql
 */
export const graphQLFragmentRequestHook: RequestHook = async (context: RequestHookContext) => {
  const queryGql = filterJsonAndTestGQL(context.request.getBody())
  if (!queryGql) return

  const newQuery = removeUnusedFragments(removeDuplicateFragments(queryGql.query))

  // Build new query
  queryGql.query = newQuery
  const newBody = {
    mimeType: 'application/graphql',
    text: JSON.stringify(queryGql),
  }
  context.request.setBody(newBody)
}
