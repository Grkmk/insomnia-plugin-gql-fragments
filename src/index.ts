import { RequestHook } from './insomnia/types/request-hook'
import { RequestAction } from './insomnia/types/request-action'
import { graphQLFragmentRequestHook } from './request-hook/request-hook'
import { generateReqID, generateSingleGQLFile } from './request-action/request-action'
import { generateGQLFile } from './request-group-action/request-group-action'
import { FragTag } from './template-tags/frag'
import { GQLTag } from './template-tags/gql'
import { changeSyncFolder } from './workspace-actions/workspace-action'
import { TemplateTag } from './insomnia/types/template-tag'

export const requestHooks = [graphQLFragmentRequestHook] as RequestHook[]
export const requestActions = [generateReqID, generateSingleGQLFile] as RequestAction[]
export const requestGroupActions = [generateGQLFile]

export const templateTags = [FragTag, GQLTag] as TemplateTag[]

export const workspaceActions = [changeSyncFolder]
