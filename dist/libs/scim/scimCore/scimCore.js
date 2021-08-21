"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scimCore = void 0;
class scimCore {
    static listResponse(resources) {
        let listResponse = {
            schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
            itemsPerPage: 1,
            startIndex: 1,
            totalResults: resources.length,
            Resources: [],
        };
        resources.forEach((element) => {
            let rsc = {
                schemas: [
                    "urn:ietf:params:scim:schemas:core:2.0:User",
                    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
                ],
                userName: element.UserPrincipalName,
                displayName: element.DisplayName,
                id: element.ObjectGUID,
                externalId: element.externalId,
                active: (element.AccountEnabled === 'Enable') ? true : false,
                name: element.FirstName || element.LastName ? {
                    givenName: element.FirstName ? element.FirstName : undefined,
                    familyName: element.LastName ? element.LastName : undefined,
                } : undefined,
                emails: [
                    {
                        type: 'work',
                        primary: true,
                        value: element.Email,
                    },
                ],
                addresses: element.Country ? [
                    {
                        type: 'work',
                        country: element.Country,
                        primary: true
                    },
                ] : undefined,
                phoneNumbers: element.Phone ? [
                    {
                        type: 'work',
                        value: element.Phone,
                    },
                ] : undefined,
                'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': element.Company || element.Department || element.EmployeeID ?
                    {
                        organization: element.Company ? element.Company : undefined,
                        department: element.Department ? element.Department : undefined,
                        employeeNumber: element.EmployeeID ? element.EmployeeID : undefined,
                    } : {},
                meta: {
                    resourceType: 'User',
                    created: element.createdDateTime,
                    lastModified: element.updateLastTime,
                    location: `https://directoryobjectservice.azurewebsites.net/scim/v2/Users/${element.ObjectGUID}`,
                }
            };
            listResponse.Resources.push(rsc);
        });
        return listResponse;
    }
    static knownResource(resource) {
        return {
            schemas: [
                "urn:ietf:params:scim:schemas:core:2.0:User",
                "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
            ],
            userName: resource.UserPrincipalName,
            displayName: resource.DisplayName,
            id: resource.ObjectGUID,
            externalId: resource.externalId,
            active: (resource.AccountEnabled === 'Enable') ? true : false,
            name: resource.FirstName || resource.LastName ? {
                givenName: resource.FirstName ? resource.FirstName : undefined,
                familyName: resource.LastName ? resource.LastName : undefined,
            } : undefined,
            emails: [
                {
                    type: 'work',
                    primary: true,
                    value: resource.Email,
                },
            ],
            addresses: resource.Country ? [
                {
                    type: 'work',
                    country: resource.Country,
                    primary: true
                },
            ] : undefined,
            phoneNumbers: resource.Phone ? [
                {
                    type: 'work',
                    value: resource.Phone,
                },
            ] : undefined,
            "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": resource.Company || resource.Department || resource.EmployeeID ?
                {
                    organization: resource.Company ? resource.Company : undefined,
                    department: resource.Department ? resource.Department : undefined,
                    employeeNumber: resource.EmployeeID ? resource.EmployeeID : undefined,
                } : {},
            meta: {
                resourceType: 'User',
                created: resource.createdDateTime,
                lastModified: resource.updateLastTime,
                location: `https://directoryobjectservice.azurewebsites.net/scim/v2/Users/${resource.ObjectGUID}`,
            }
        };
    }
    static convertAttributeToScimuser(body) {
        const enterpriseExtension = body['urn:ietf:params:scim:schemas:extension:enterprise:2.0:User'] ?
            body['urn:ietf:params:scim:schemas:extension:enterprise:2.0:User']
            : undefined;
        return {
            externalId: body.externalId,
            UserPrincipalName: body.userName,
            DisplayName: body.displayName,
            FirstName: body.name ? body.name.givenName : undefined,
            LastName: body.name ? body.name.familyName : undefined,
            Email: body.emails ? body.emails.filter(element => {
                return element.type === 'work';
            })[0].value : undefined,
            Country: body.addresses ? body.addresses.filter(element => {
                return element.type === 'work';
            })[0].country : undefined,
            Phone: body.phoneNumbers ? body.phoneNumbers.filter(element => {
                return element.type === 'work';
            })[0].value : undefined,
            AccountEnabled: body.active === true ? 'Enable' : 'Disable',
            Company: enterpriseExtension && enterpriseExtension.organization ?
                enterpriseExtension.organization : undefined,
            Department: enterpriseExtension && enterpriseExtension.department ?
                enterpriseExtension.department : undefined,
            EmployeeID: enterpriseExtension && enterpriseExtension.employeeNumber ?
                enterpriseExtension.employeeNumber : undefined
        };
    }
    static parsePatchOp(body) {
        const scimUser = {};
        const operations = body.Operations;
        const mutability = ['username', 'displayname', 'emails[type eq "work"].value', 'active'];
        operations.forEach(element => {
            if (element.op.toLowerCase() === 'add') {
                if (element.path.toLowerCase() === 'username') {
                    scimUser.UserPrincipalName = element.value;
                }
                if (element.path.toLowerCase() === 'displayname') {
                    scimUser.DisplayName = element.value;
                }
                if (element.path.toLowerCase() === 'name.givenname') {
                    scimUser.FirstName = element.value;
                }
                if (element.path.toLowerCase() === 'name.familyname') {
                    scimUser.LastName = element.value;
                }
                if (element.path.toLowerCase() === 'emails[type eq "work"].value') {
                    scimUser.Email = element.value;
                }
                if (element.path.toLowerCase() === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:organization') {
                    scimUser.Company = element.value;
                }
                if (element.path.toLowerCase() === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:department') {
                    scimUser.Department = element.value;
                }
                if (element.path.toLowerCase() === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:employeenumber') {
                    scimUser.EmployeeID = element.value;
                }
                if (element.path.toLowerCase() === 'addresses[type eq "work"].country') {
                    scimUser.Country = element.value;
                }
                if (element.path.toLowerCase() === 'active') {
                    scimUser.AccountEnabled = element.value.toLocaleLowerCase() === 'true' ? 'Enable' : 'Disable';
                }
            }
            // Operation: remove
            // Azure AD does not send Remove to a single attribute
            if (element.op.toLocaleLowerCase() === 'remove') {
                // If an attribute is removed or becomes unassigned and is defined as a required or read-only,
                // If target path is not undefined, responses scimError 400 "noTarget" - RFC7644 3.12.
                // if (!element.path) return scimErrors.scimErrorNoTarget()
                // // response scimError 400 "mutabliliy" - RFC7644.
                // if (mutability.includes(element.path.toLowerCase())) return scimErrors.scimErrorMutability(element.path)
                if (element.path.toLowerCase() === 'name.givenname') {
                    scimUser.FirstName = undefined;
                }
                if (element.path.toLowerCase() === 'name.familyname') {
                    scimUser.LastName = undefined;
                }
                if (element.path.toLowerCase() === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:organization') {
                    scimUser.Company = undefined;
                }
                if (element.path.toLowerCase() === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:department') {
                    scimUser.Department = undefined;
                }
                if (element.path.toLowerCase() === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:employeenumber') {
                    scimUser.EmployeeID = undefined;
                }
                if (element.path.toLowerCase() === 'addresses.country') {
                    scimUser.Country = undefined;
                }
            }
            // Operation: replace
            if (element.op.toLowerCase() === 'replace') {
                if (element.path.toLowerCase() === 'username') {
                    scimUser.UserPrincipalName = element.value;
                }
                if (element.path.toLowerCase() === 'displayname') {
                    scimUser.DisplayName = element.value;
                }
                if (element.path.toLowerCase() === 'name.givenname') {
                    scimUser.FirstName = element.value;
                }
                if (element.path.toLowerCase() === 'name.familyname') {
                    scimUser.LastName = element.value;
                }
                if (element.path.toLowerCase() === 'emails[type eq "work"].value') {
                    scimUser.Email = element.value;
                }
                if (element.path.toLowerCase() === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:organization') {
                    scimUser.Company = element.value;
                }
                if (element.path.toLowerCase() === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:department') {
                    scimUser.Department = element.value;
                }
                if (element.path.toLowerCase() === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:employeenumber') {
                    scimUser.EmployeeID = element.value;
                }
                if (element.path.toLowerCase() === 'addresses[type eq "work"].country') {
                    scimUser.Country = element.value;
                }
                if (element.path.toLowerCase() === 'active') {
                    scimUser.AccountEnabled = element.value.toLocaleLowerCase() === 'true' ? 'Enable' : 'Disable';
                }
            }
        });
        return scimUser;
    }
}
exports.scimCore = scimCore;
