"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scimErrors = void 0;
class scimErrors {
    constructor() { }
    static scimErrorNotFound(userId) {
        return {
            schemas: 'urn:ietf:params:scim:api:messages:2.0:Error',
            detail: `Resouce ${userId} not found.`,
            status: 404,
        };
    }
    static scimErrorConfilctTarget() {
        return {
            schemas: 'urn:ietf:params:scim:api:messages:2.0:Error',
            detail: 'Duplicate key error index.',
            status: 409
        };
    }
    static scimErrorNoTarget() {
        return {
            schemas: 'urn:ietf:params:scim:api:messages:2.0:Error',
            detail: `The target path is not undefined.`,
            status: 400,
        };
    }
    static scimErrorMutability(path) {
        return {
            schemas: 'urn:ietf:params:scim:api:messages:2.0:Error',
            detail: `The target path "${path}" is required.`,
            status: 400,
        };
    }
    static scimErrorUnauthrorized() {
        return {
            schemas: 'urn:ietf:params:scim:api:messages:2.0:Error',
            detail: 'Authorization failure. The authrorization header is invalid or missing.',
            status: 401,
        };
    }
    static scimErrorNotImplemented() {
        return {
            schemas: 'urn:ietf:params:scim:api:messages:2.0:Error',
            detail: 'Service provider does not support the request.',
            status: 501,
        };
    }
}
exports.scimErrors = scimErrors;
