import { bankAccounts } from '../../pageObjects/BankAccounts';
import * as authN from './../../fixtures/authN.json';
import * as statusCodes from './../../fixtures/statusCodes.json';
import * as accountData from '../../fixtures/accountData.json';

describe("Manage user's bank accounts", () => {
    beforeEach(() => {
        cy.task("db:seed")
        Cypress.Cookies.preserveOnce('connect.sid')
        
    })

    before(() => {
        cy.loginUI(authN.username, authN.password, statusCodes.OK)
    })

    afterEach(() => {
        cy.task("db:seed")
    })

    it("Add bank account", () => {
        bankAccounts
            .openList()
            .openNewForm()
            .addDataAndValidate( {
                "bankName": accountData.account.bankName, 
                "routingNumber": accountData.account.routingNumber, 
                "accountNumber": accountData.account.accountNumber
            } )
            .submitForm()
        bankAccounts.elements.bankAccountListItem().last().contains(accountData.account.bankName)
    })

    it("Delete bank account", () => {
        bankAccounts
            .openList()
            .deleteFirstItem()
    })
})

describe("Check validation messages", () => {

    before(() => {
        cy.task("db:seed")
        cy.loginUI(authN.username, authN.password, statusCodes.OK)
        bankAccounts
            .openList()
            .openNewForm()
        })
        
        
    it("Bank Name: value not provided", () => {
        bankAccounts.addDataAndValidate( {
        "bankName": accountData.inputValidation.empty.bankName
        } )
    })
    
    it("Bank Name: incorrect value provided", () => {
        accountData.inputValidation.incorrect.forEach(set => {
            bankAccounts.addDataAndValidate( {
            "bankName": set.bankName
            } )
        })
    })

    it("Bank Name: correct value provided", () => {
        bankAccounts.addDataAndValidate( {
        "bankName": accountData.account.bankName
        } )
    })

    it("Routing number: value not provided", () => {
        bankAccounts.addDataAndValidate( {
        "routingNumber": accountData.inputValidation.empty.routingNumber
        } )
    })

    it("Routing number: incorrect value provided", () => {
        accountData.inputValidation.incorrect.forEach(set => {
            bankAccounts.addDataAndValidate( {
            "routingNumber": set.routingNumber
            } )
        })
    })

    it("Routing number: correct value provided", () => {
        bankAccounts.addDataAndValidate( {
        "routingNumber": accountData.account.routingNumber
        } )
    })

    it("Account number: value not provided", () => {
        bankAccounts.addDataAndValidate( {
        "accountNumber": accountData.inputValidation.empty.accountNumber
        } )
    })

    it("Account number: incorrect value provided", () => {
        accountData.inputValidation.incorrect.forEach(set => {
            bankAccounts.addDataAndValidate( {
            "accountNumber": set.accountNumber
            } )
        })
    })

    it("Account number: correct value provided", () => {
        bankAccounts.addDataAndValidate( {
        "accountNumber": accountData.account.accountNumber
        } )
    })
})
