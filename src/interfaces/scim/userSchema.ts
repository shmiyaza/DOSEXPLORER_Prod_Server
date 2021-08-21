export interface userSchema {
    schemas?: string[],
    userName?: string,
    displayName?: string,
    id?: string,
    externalId?: string,
    name?: {
        givenName?: string,
        familyName?: string,
    },
    emails?: [
        {
            type?: 'work' | 'home',
            primary?: boolean,
            value?: string,
        }
    ],
    addresses?: [
        {
            type?: 'work' | 'home',
            country?: string,
            primary?: boolean
        }
    ],
    phoneNumbers?: [
        {
            type?: 'work' | 'home',
            value?: string
        }
    ],
    active?: boolean,
    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"?: {
        organization?: string,
        department?: string,
        employeeNumber?: string
    },
    meta?: {
        resourceType?: 'User',
        created?: Date,
        lastModified?: Date,
        location?: string,
        version?: string
    }
}