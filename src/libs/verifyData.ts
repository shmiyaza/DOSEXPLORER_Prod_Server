import { v4 } from 'uuid'

import { user } from '../interfaces/objects/user'
import { bcryptOperation } from './bcryptOperation'

export class createUserObject {
    errorCnt: number = 0
    errorMsg: string[] = []
    user: user = {}

    constructor(public inputData: user) { }

    initializeUser(data: user) {
        return {
            UserPrincipalName: data.UserPrincipalName ? data.UserPrincipalName.toString() : undefined,
            DisplayName: data.DisplayName ? data.DisplayName!.toString() : undefined,
            FirstName: data.FirstName ? data.FirstName.toString() : undefined,
            LastName: data.LastName ? data.LastName.toString() : undefined,
            Email: data.Email ? data.Email!.toString() : undefined,
            Company: data.Company ? data.Company.toString() : undefined,
            Department: data.Department ? data.Department.toString() : undefined,
            EmployeeID: data.EmployeeID ? data.EmployeeID.toString() : undefined,
            Country: data.Country ? data.Country.toString() : undefined,
            Phone: data.Phone ? data.Phone.toString() : undefined,
            AccountEnabled: data.AccountEnabled ? data.AccountEnabled.toString() : undefined,
            Password: data.Password ? data.Password.toString() : undefined,
        }
    }

    checkPassword(val: string | undefined) {
        const reg = /^[a-zA-Z0-9.?/-]{8,24}$/
        if (!val) return this.pushError('Password must be included in body')
        if (!reg.test(val)) return this.pushError(`Password: (${reg})`)
    }

    checkUserPrincipalName(val: string | undefined) {
        const reg = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
        if (!val) return this.pushError('UserPrincipalName must be included in body.')
        if (!reg.test(val)) return this.pushError(`The format of UPN is wrong. You must match RegExp (${reg})`)
    }

    checkEmail(val: string | undefined) {
        const reg = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
        if (!val) return this.pushError('Email must be included in body.')
        if (!reg.test(val)) return this.pushError(`The format of Email is wrong. You must match RegExp (${reg})`)
    }

    checkAccountEnabled(val: string | undefined) {
        if (!val || val !== 'Enable' && val !== 'Disable') {
            return this.pushError('You have to set Enable or Disable to AccountEnabled')
        }
    }

    checkDisplayName(val: string | undefined) {
        if (!val) return this.pushError('You have to set value to DisplayName')
    }

    createUser() {
        this.user = this.initializeUser(this.inputData)

        this.checkPassword(this.user.Password)
        this.checkUserPrincipalName(this.user.UserPrincipalName)
        this.checkEmail(this.user.Email)
        this.checkDisplayName(this.user.DisplayName)
        this.checkAccountEnabled(this.user.AccountEnabled)

        if (this.errorCnt) return false
        if (!this.errorCnt) {

            this.user.ObjectGUID = v4()
            this.user.createdDateTime, this.user.updateLastTime = new Date()

            bcryptOperation.toHashString(this.user.Password!)
                .then((hashedPassword) => {
                    this.user.Password = hashedPassword
                })

            return this.user
        }
    }

    pushError(msg: string) {
        this.errorCnt++
        this.errorMsg.push(msg)
    }
}