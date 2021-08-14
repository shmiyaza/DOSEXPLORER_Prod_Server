// generate scim error response
import { scimError } from "../../../interfaces/scim/scimError"

export class scimErrors {

    constructor() { }

    static scimErrorNotFound(userId: string): scimError {
        return {
            schemas: 'urn:ietf:params:scim:api:messages:2.0:Error',
            detail: `Resouce ${userId} not found.`,
            status: 404,
        }
    }

    static scimErrorNoTarget(): scimError {
        return {
            schemas: 'urn:ietf:params:scim:api:messages:2.0:Error',
            detail: `The target path is not undefined.`,
            status: 400,
        }
    }

    static scimErrorMutability(path: string): scimError {
        return {
            schemas: 'urn:ietf:params:scim:api:messages:2.0:Error',
            detail: `The target path "${path}" is required.`,
            status: 400,
        }
    }

    static scimErrorUnauthrorized(): scimError {
        return {
            schemas: 'urn:ietf:params:scim:api:messages:2.0:Error',
            detail: 'Authorization failure. The authrorization header is invalid or missing.',
            status: 401,
        }
    }

    static scimErrorNotImplemented(): scimError {
        return {
            schemas: 'urn:ietf:params:scim:api:messages:2.0:Error',
            detail: 'Service provider does not support the request.',
            status: 501,
        }
    }
}
