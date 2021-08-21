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
    static convertAttributeToUser(resource) {
        const scimUser = {};
        Object.keys(resource).forEach(key => {
            if (!resource[key]) {
                return;
            }
            else {
                if (key === 'username')
                    scimUser.UserPrincipalName = resource.username;
                if (key === 'displayname')
                    scimUser.DisplayName = resource.displayname;
                if (key === 'emails[type eq \"work\"].value')
                    scimUser.Email = resource["emails[type eq \"work\"].value"];
                if (key === 'addresses[type eq \"work\"].country')
                    scimUser.Country = resource["addresses[type eq \"work\"].country"];
                if (key === 'active')
                    scimUser.AccountEnabled = resource.active ? 'Enable' : 'Disable';
                if (key === 'familyname')
                    scimUser.LastName = resource["name.familyname"];
                if (key === 'givenname')
                    scimUser.FirstName = resource["name.givenname"];
                if (key === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:department')
                    scimUser.Department = resource["urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:department"];
                if (key === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:employeenumber')
                    scimUser.EmployeeID = resource["urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:employeenumber"];
                if (key === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:organization')
                    scimUser.Company = resource["urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:organization"];
            }
        });
        return scimUser;
    }
    static parsePatchOp(patchOp) {
        let returnUser = {};
        patchOp.Operations.forEach(element => {
            if (element.op.toLowerCase() === 'add' || 'replace')
                returnUser[element.path.toLowerCase()] = element.value;
            if (element.op.toLowerCase() === 'remove') {
                returnUser[element.path.toLowerCase()] = undefined;
            }
        });
        return returnUser;
    }
}
exports.scimCore = scimCore;
