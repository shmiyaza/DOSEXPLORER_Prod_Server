"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchOperation = void 0;
class patchOperation {
    constructor() {
        this.returnUser = {};
    }
    parsePatchOp(patchOp) {
        patchOp.Operations.forEach(element => {
            if (element.op.toLowerCase() === 'add' || 'replace')
                this.returnUser[element.path] = element.value;
            if (element.op.toLowerCase() === 'remove') {
                this.returnUser[element.path] = undefined;
            }
        });
    }
}
exports.patchOperation = patchOperation;
