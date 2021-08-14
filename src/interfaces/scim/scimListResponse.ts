import { scimUser } from './scimUser'

export interface scimListReponse {
    Resources: scimUser[],
    itemsPerPage: number,
    startIndex: number,
    totalResults: number,
    schemas: string[]
}