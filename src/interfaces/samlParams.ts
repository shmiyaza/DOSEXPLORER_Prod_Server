export interface authnParams {
    Id?: string,
    IssueInstant?: string,
    AssertionConsumerServiceURL: string,
    ForceAuthn: string,
    isPassive: string,
    NameIdPolicy: string,
    RequestedAuthnContext: string,
    Issuer: string,
    Cert: string
}

export interface samlRequest {
    samlRequest: string,
    RelayState?: string,
}