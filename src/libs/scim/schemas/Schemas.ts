export const Schemas = [
    {
        description: "User Account",
        id: "urn:ietf:params:scim:schemas:core:2.0:User",
        name: "User of DOSEXPLORER",
        attributes: [
            {
                caseExact: false,
                type: "String",
                description: "Unique identifier for the User, typically used by the user to directly authenticate to the service provider. Each User MUST include a non-empty userName value.  This identifier MUST be unique across the service provider's entire set of Users. REQUIRED.",
                mutability: "readWrite",
                name: "userName",
                multiValued: false,
                required: true,
                returned: "default",
                uniqueness: "server"
            },

            {
                caseExact: false,
                type: "String",
                description: "The name of the User, suitable for display to end-users.  The name SHOULD be the full name of the User being described, if known.",
                mutability: "readWrite",
                name: "displayName",
                multiValued: false,
                required: true,
                returned: "default",
                uniqueness: "none"
            },

            {
                caseExact: false,
                type: "String",
                description: "The givenName of the user, suitable for givenName to end-users. OPTIONAL",
                mutability: "readWrite",
                name: "name.givenName",
                multiValued: false,
                required: false,
                returned: "default",
                uniqueness: "none"
            },

            {
                caseExact: false,
                type: "String",
                description: "The familyName of the user, suitable for familyName to end-users. OPTIONAL",
                mutability: "readWrite",
                name: "name.familyName",
                multiValued: false,
                required: false,
                returned: "default",
                uniqueness: "none"
            },

            {
                caseExact: false,
                type: "String",
                description: "Email addresses for the user.  The value SHOULD be canonicalized by the service provider, e.g., \"bjensen@example.com\" instead of \"bjensen@EXAMPLE.COM\". Canonical type values of \"work\", \"home\", and \"other\".",
                mutability: "readWrite",
                name: "emails[type eq \"work\"].value",
                multiValued: false,
                required: true,
                returned: "default",
                uniqueness: "server"
            },

            {
                caseExact: false,
                type: "String",
                description: "The country name of the user. OPTIONAL",
                mutability: "readWrite",
                name: "addresses[type eq \"work\"].country",
                multiValued: false,
                required: false,
                returned: "default",
                uniqueness: "none"
            },

            {
                caseExact: false,
                type: "String",
                description: "Phone numbers for the User.  The value SHOULD be canonicalized by the service provider according to the format specified in RFC 3966, e.g., \"tel:+1-201-555-0123\". Canonical type values of \"work\", \"home\", \"mobile\", \"fax\", \"pager\", and \"other\".",
                mutability: "readWrite",
                name: "phoneNumbers[type eq \"work\"].value",
                multiValued: false,
                required: false,
                returned: "default",
                uniqueness: "none"
            },

            {
                caseExact: false,
                type: "Boolean",
                description: "A Boolean value indicating the User's administrative status.",
                mutability: "readWrite",
                name: "active",
                multiValued: false,
                required: true,
                returned: "default",
                uniqueness: "none"
            },

        ]
    },

    {
        description: "Enterprise User",
        id: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
        name: "Enterprise user of DOSEXPLORER",
        attributes: [

            {
                caseExact: false,
                type: "String",
                description: "Identifies the name of a organization.",
                mutability: "readWrite",
                name: "organization",
                multiValued: false,
                required: false,
                returned: "default",
                uniqueness: "none"
            },

            {
                caseExact: false,
                type: "String",
                description: "Identifies the name of a department.",
                mutability: "readWrite",
                name: "department",
                multiValued: false,
                required: false,
                returned: "default",
                uniqueness: "none"
            },

            {
                caseExact: false,
                type: "String",
                description: "Numeric or alphanumeric identifier assigned to a person, typically based on order of hire or association with an organization.",
                mutability: "readWrite",
                name: "employeeNumber",
                multiValued: false,
                required: false,
                returned: "default",
                uniqueness: "none"
            },
        ]
    }
]


