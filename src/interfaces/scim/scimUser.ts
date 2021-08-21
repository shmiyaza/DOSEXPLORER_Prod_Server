import { user } from '../objects/user'

export interface scimUser extends user {
    externalId?: string,

}