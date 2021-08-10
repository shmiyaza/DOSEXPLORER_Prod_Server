import { v4 } from 'uuid'

import { user, userAttributes } from '../interfaces/objects/user'
import { bcryptOperation } from './bcryptOperation'

export class userManagement {
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
        if (val && !reg.test(val))
            return this.pushError(`The format of Email is wrong. You must match RegExp (${reg})`)
    }

    checkAccountEnabled(val: string | undefined) {
        if (!val || val !== 'Enable' && val !== 'Disable') {
            return this.pushError('You have to set Enable or Disable to AccountEnabled')
        }
    }

    checkDisplayName(val: string | undefined) {
        if (!val) return this.pushError('You have to set value to DisplayName')
    }

    checkAttribute(attributes: user) {
        Object.keys(attributes).forEach((key) => {
            if (userAttributes.indexOf(key) === -1)
                this.pushError(`${key} is undefined in the schema`)
        })
    }

    checkObjectGUID(val: string | undefined) {
        if (val)
            this.pushError('ObjectGUID is readonly.')
    }

    checkCreatedDateTime(val: Date | undefined) {
        if (val)
            this.pushError('createdDateTime is readonly.')
    }

    checkUpdateLastTime(val: Date | undefined) {
        if (val)
            this.pushError('updateLastTime is readonly.')
    }

    createUser() {
        this.user = this.initializeUser(this.inputData)
        this.checkPassword(this.user.Password)
        this.checkUserPrincipalName(this.user.UserPrincipalName)
        this.checkEmail(this.user.Email)
        this.checkDisplayName(this.user.DisplayName)
        this.checkAccountEnabled(this.user.AccountEnabled)
        this.checkUpdateLastTime(this.user.updateLastTime)
        this.checkCreatedDateTime(this.user.createdDateTime)
        this.checkObjectGUID(this.user.ObjectGUID)
        this.checkAttribute(this.user)


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

    updateUser() {
        this.inputData

        Object.keys(this.inputData).forEach(key => {
            if (key === 'UserPrincipalName') { this.checkUserPrincipalName(this.inputData.UserPrincipalName) }
            if (key === 'Email') { this.checkEmail(this.inputData.Email!) }
            if (key === 'DisplayName') { this.checkDisplayName(this.inputData.DisplayName!) }
            if (key === 'AccountEnabled') { this.checkAccountEnabled(this.inputData.AccountEnabled!) }
            if (key === "Password") { this.pushError('Do not update password patch api.') }
            if (key === "updateLastTime") { this.checkUpdateLastTime(this.inputData.updateLastTime) }
            if (key === "createdDateTime") { this.checkCreatedDateTime(this.inputData.createdDateTime) }
            if (key === "ObjectGUID") { this.checkObjectGUID(this.inputData.ObjectGUID) }
        });
        this.checkAttribute(this.inputData)

        if (this.errorCnt) {
            return false
        } else {
            this.inputData.updateLastTime = new Date()
            return this.inputData
        }
    }

    pushError(msg: string) {
        this.errorCnt++
        this.errorMsg.push(msg)
    }
}