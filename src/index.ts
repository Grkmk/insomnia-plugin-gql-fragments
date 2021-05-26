import { RequestHook } from './insomnia/types/request-hook'
import { RequestAction } from './insomnia/types/request-action'
import { graphQLFragmentRequestHook } from './request-hook/request-hook'
import { generateReqID } from './request-action/request-action'
import { generateGQLFile } from './request-group-action/request-group-action'
import { FragTag } from './template-tags/frag'
import { GQLTag } from './template-tags/gql'
import { changeSyncFolder } from './workspace-actions/workspace-action'

export const requestHooks = [graphQLFragmentRequestHook] as RequestHook[]
export const requestActions = [generateReqID] as RequestAction[]
export const requestGroupActions = [generateGQLFile]

export const templateTags = [FragTag, GQLTag]

export const workspaceActions = [changeSyncFolder]
