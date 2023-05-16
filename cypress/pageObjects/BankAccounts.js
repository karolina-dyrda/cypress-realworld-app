import * as graphQL from "../utils/graphQL-utils"

class BankAccounts {
    elements = {
        sideNavPageBankAccount: () => cy.get('[data-test="sidenav-bankaccounts"]'),
        createBtn: () => cy.get('[data-test="bankaccount-new"]'),
        deleteBtn: () => cy.get('[data-test="bankaccount-delete"]'),
        bankAccountList: () => cy.get('[data-test="bankaccount-list"]'),
        bankAccountListItem: () => cy.get('[data-test="bankaccount-list"] li'),
        inputBankName: () => cy.get('#bankaccount-bankName-input'),
        inputRoutingNr: () => cy.get('#bankaccount-routingNumber-input'),
        inputAccountNr: () => cy.get('#bankaccount-accountNumber-input'),
        submitBtn: () => cy.get('[data-test="bankaccount-submit"]')
    }

    openList() {
        this.elements.sideNavPageBankAccount().click()
        cy.url().should('include', '/bankaccounts')
        return this
    }

    openNewForm() {
        this.elements.createBtn().click()
        cy.url().should('include', '/bankaccounts/new')
        return this
    }

    addData(bankName, routingNr, accountNr) {
        this.elements.inputBankName().type(bankName)
        this.elements.inputRoutingNr().type(routingNr)
        this.elements.inputAccountNr().type(accountNr)
        return this
    }

    submitForm() {
        cy.intercept('POST', Cypress.env('api'), (req) => {
            graphQL.setAlias(req, 'CreateBankAccount')
            graphQL.setAlias(req, 'ListBankAccount')
          })

        this.elements.submitBtn().click()
        cy.wait('@CreateBankAccount')
        cy.wait('@ListBankAccount')
        return this
    }

    create(bankName, routingNr, accountNr) {
        this.openList()
        this.openNewForm()
        this.addData(bankName, routingNr, accountNr)
        this.submitForm()
    }
}

export default BankAccounts = new BankAccounts()
