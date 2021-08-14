export interface scimPatchOp {
    schemas: string[],
    Operations:
    [
        {
            op: string,
            path: string,
            value: string,
        }
    ]
}