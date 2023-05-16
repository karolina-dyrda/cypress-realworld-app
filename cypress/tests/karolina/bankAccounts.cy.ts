import BankAccounts from '../../pageObjects/BankAccounts';
import * as authN from './../../fixtures/authN.json';
import * as statusCodes from './../../fixtures/statusCodes.json';
import * as accountData from '../../fixtures/accountData.json';

describe("User adds a bank account", () => {
    it("Happy path", () => {
        cy.loginUI(authN.username, authN.password, statusCodes.OK)
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
})
