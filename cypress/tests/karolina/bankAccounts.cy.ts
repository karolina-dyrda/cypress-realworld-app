import BankAccounts from '../../pageObjects/BankAccounts';
import * as authN from './../../fixtures/authN.json';
import * as statusCodes from './../../fixtures/statusCodes.json';
import * as accountData from '../../fixtures/accountData.json';

describe("Manage user's bank accounts", () => {
    beforeEach(() => {
        cy.task("db:seed")
        cy.loginUI(authN.username, authN.password, statusCodes.OK)
    })

    it("Add bank account", () => {
        BankAccounts
            .openList()
            .openNewForm()
            .addData(
                accountData.account.bankName, 
                accountData.account.routingNr, 
                accountData.account.accountNr)
            .submitForm()
        BankAccounts.elements.bankAccountListItem().last().contains(accountData.account.bankName)
    })

    it.only("Delete bank account", () => {
        BankAccounts
            .openList()
            .deleteFirstItem()
        cy.task("db:seed")
    })
})
