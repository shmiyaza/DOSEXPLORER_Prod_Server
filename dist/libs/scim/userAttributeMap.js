"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAttributeMap = void 0;
// for patchOperations
function userAttributeMap(elementPath) {
    if (elementPath.toLowerCase() === 'username') {
        return 'UserPrincipalName';
    }
    if (elementPath.toLowerCase() === 'displayname') {
        return 'DisplayName';
    }
    if (elementPath.toLowerCase() === 'name.givenname') {
        return 'FirstName';
    }
    if (elementPath.toLowerCase() === 'name.familyname') {
        return 'LastName';
    }
    if (elementPath.toLowerCase() === 'emails[type eq "work"].value') {
        return 'Email';
    }
    if (elementPath.toLowerCase() === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:organization') {
        return 'Company';
    }
    if (elementPath.toLowerCase() === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:department') {
        return 'Department';
    }
    if (elementPath.toLowerCase() === 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:user:employeenumber') {
        return 'EmployeeID';
    }
    if (elementPath.toLowerCase() === 'addresses[type eq "work"].country') {
        return 'Country';
    }
    if (elementPath.toLowerCase() === 'active') {
        return 'AccountEnabled';
    }
}
exports.userAttributeMap = userAttributeMap;
