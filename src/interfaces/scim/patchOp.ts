export interface patchOp {
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