export interface patchUser {
    username: string,
    displayname: string,
    'name.givenname': string,
    'name.familyname': string,
    'emails[type eq "work"].value': string,
    'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:organization': string,
    'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:department': string,
    'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:employeenumber': string,
    'addresses[type eq "work"].country': string,
    'active': boolean
}