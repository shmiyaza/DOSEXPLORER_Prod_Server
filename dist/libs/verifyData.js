"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserObject = void 0;
const uuid_1 = require("uuid");
const bcryptOperation_1 = require("./bcryptOperation");
class createUserObject {
    constructor(inputData) {
        this.inputData = inputData;
        this.errorCnt = 0;
        this.errorMsg = [];
        this.user = {};
    }
    initializeUser(data) {
        return {
            UserPrincipalName: data.UserPrincipalName ? data.UserPrincipalName.toString() : undefined,
            DisplayName: data.DisplayName ? data.DisplayName.toString() : undefined,
            FirstName: data.FirstName ? data.FirstName.toString() : undefined,
            LastName: data.LastName ? data.LastName.toString() : undefined,
            Email: data.Email ? data.Email.toString() : undefined,
            Company: data.Company ? data.Company.toString() : undefined,
            Department: data.Department ? data.Department.toString() : undefined,
            EmployeeID: data.EmployeeID ? data.EmployeeID.toString() : undefined,
            Country: data.Country ? data.Country.toString() : undefined,
            Phone: data.Phone ? data.Phone.toString() : undefined,
            AccountEnabled: data.AccountEnabled ? data.AccountEnabled.toString() : undefined,
            Password: data.Password ? data.Password.toString() : undefined,
        };
    }
    checkPassword(val) {
        const reg = /^[a-zA-Z0-9.?/-]{8,24}$/;
        if (!val)
            return this.pushError('Password must be included in body');
        if (!reg.test(val))
            return this.pushError(`Password: (${reg})`);
    }
    checkUserPrincipalName(val) {
        const reg = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
        if (!val)
            return this.pushError('UserPrincipalName must be included in body.');
        if (!reg.test(val))
            return this.pushError(`The format of UPN is wrong. You must match RegExp (${reg})`);
    }
    checkEmail(val) {
        const reg = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
        if (val && !reg.test(val))
            return this.pushError(`The format of Email is wrong. You must match RegExp (${reg})`);
    }
    checkAccountEnabled(val) {
        if (!val || val !== 'Enable' && val !== 'Disable') {
            return this.pushError('You have to set Enable or Disable to AccountEnabled');
        }
    }
    checkDisplayName(val) {
        if (!val)
            return this.pushError('You have to set value to DisplayName');
    }
    createUser() {
        this.user = this.initializeUser(this.inputData);
        this.checkPassword(this.user.Password);
        this.checkUserPrincipalName(this.user.UserPrincipalName);
        this.checkEmail(this.user.Email);
        this.checkDisplayName(this.user.DisplayName);
        this.checkAccountEnabled(this.user.AccountEnabled);
        if (this.errorCnt)
            return false;
        if (!this.errorCnt) {
            this.user.ObjectGUID = uuid_1.v4();
            this.user.createdDateTime, this.user.updateLastTime = new Date();
            bcryptOperation_1.bcryptOperation.toHashString(this.user.Password)
                .then((hashedPassword) => {
                this.user.Password = hashedPassword;
            });
            return this.user;
        }
    }
    pushError(msg) {
        this.errorCnt++;
        this.errorMsg.push(msg);
    }
}
exports.createUserObject = createUserObject;
