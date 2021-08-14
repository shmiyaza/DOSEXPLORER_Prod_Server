"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceProviderConfig = void 0;
exports.serviceProviderConfig = {
    "authenticationSchemes": [
        {
            "type": "oauthbearertoken",
            "name": "auth",
            "description": "support only OAuth bearer token"
        }
    ],
    "meta": {
        "resourceType": "ServiceProviderConfig"
    },
    "bulk": {
        "maxOperations": 0,
        "maxPayloadSize": 0,
        "supported": false
    },
    "documentationUrl": null,
    "eTag": {
        "supported": false
    },
    "filter": {
        "supported": true
    },
    "changePassword": {
        "supported": false
    },
    "patch": {
        "supported": true
    },
    "sort": {
        "supported": false
    },
    "schemas": [
        "urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig"
    ]
};
