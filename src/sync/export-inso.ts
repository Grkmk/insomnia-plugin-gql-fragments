import { Body } from '../insomnia/types/request-context'

export enum InsomniaExportResourceType {
  FOLDER = 'request_group',
  REQUEST = 'request',
  // Anything else like unit tests but not needed
}

export interface InsomniaExport {
  resources: InsomniaExportResource[]
}

export interface InsomniaExportResource {
  _id: string
  parentId: string
  name: string
  description: string
  _type: InsomniaExportResourceType
  body: Body
}
