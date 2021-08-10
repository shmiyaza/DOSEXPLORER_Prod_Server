export interface user extends Object {
    ObjectGUID?: string,
    UserPrincipalName?: string,
    DisplayName?: string,
    FirstName?: string,
    LastName?: string,
    Email?: string,
    Company?: string,
    Department?: string,
    EmployeeID?: string,
    Country?: string,
    Phone?: string,
    AccountEnabled?: string,
    createdDateTime?: Date,
    updateLastTime?: Date,
    Password?: string,
}

export const userAttributes = [
    'ObjectGUID',
    'UserPrincipalName',
    'DisplayName',
    'FirstName',
    'LastName',
    'Email',
    'Company',
    'Department',
    'EmployeeID',
    'Country',
    'Phone',
    'AccountEnabled',
    'createdDateTime',
    'updateLastTime',
    'Password',
    'externalId',
]