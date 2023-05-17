import BankAccounts from '../../pageObjects/BankAccounts';
import * as authN from './../../fixtures/authN.json';
import * as statusCodes from './../../fixtures/statusCodes.json';
import * as accountData from '../../fixtures/accountData.json';

describe("User manages their bank accounts", () => {
    beforeEach(() => {
        cy.task("db:seed")
        cy.loginUI(authN.username, authN.password, statusCodes.OK)
    })

    it("Add bank account", () => {
        BankAccounts
            .openList()
            .openNewForm()
            .addData(
                accountData.bankName, 
                accountData.routingNr, 
                accountData.accountNr)
            .submitForm()
        BankAccounts.elements.bankAccountListItem().last().contains(accountData.bankName)
    })

    it("Delete bank account", () => {
        BankAccounts
            .openList()
            .deleteFirstItem()
    })
})
