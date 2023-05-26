import * as graphQL from "../utils/graphQL-utils"
import * as messages from "../fixtures/messages.json"

class BankAccounts {
    elements = {
        createBtn: () => cy.get('[data-test="bankaccount-new"]'),
        deleteBtn: () => cy.get('[data-test="bankaccount-delete"]'),
        bankAccountList: () => cy.get('[data-test="bankaccount-list"]'),
        bankAccountListItem: () => cy.get('[data-test="bankaccount-list"] li'),
        inputBankName: () => cy.get('#bankaccount-bankName-input'),
        inputRoutingNr: () => cy.get('#bankaccount-routingNumber-input'),
        inputAccountNr: () => cy.get('#bankaccount-accountNumber-input'),
        submitBtn: () => cy.get('[data-test="bankaccount-submit"]'),
        hintBankName: () => cy.get('#bankaccount-bankName-input-helper-text'),
        hintRoutingNr: () => cy.get('#bankaccount-routingNumber-input-helper-text'),
        hintAccountNr: () => cy.get('#bankaccount-accountNumber-input-helper-text')
    }

    openList() {
        cy.sideNavi("bankaccounts")
        cy.url().should('include', '/bankaccounts')
        return this
    }

    openNewForm() {
        this.elements.createBtn().click()
        cy.url().should('include', '/bankaccounts/new')
        return this
    }

    addDataAndValidate(fields: Field) {
        Object.keys(fields).forEach(field => {
            const fieldName = field as FieldName
            const fieldValue = fields[fieldName]
            
            if (fieldValue) {
                cy.get(`#bankaccount-${fieldName}-input`).clear().type(fieldValue)
                cy.get('body').click(0,0);
            }
            this.validate(fieldName)
        })
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

    create(fields: Field) {
        this.openList()
        this.openNewForm()
        this.addDataAndValidate(fields)
        this.submitForm()
    }

    deleteFirstItem() {
        cy.intercept('POST', Cypress.env('api'), (req) => {
            graphQL.setAlias(req, 'DeleteBankAccount')
            graphQL.setAlias(req, 'ListBankAccount')
          })
        this.elements.bankAccountListItem().first()
        .then(firstItem => {
            cy.wrap(firstItem).find('[data-test="bankaccount-delete"]').click()
            cy.wait('@DeleteBankAccount')
            cy.wait('@ListBankAccount')
            cy.wrap(firstItem).find('[data-test="bankaccount-delete"]').should('not.exist')
            cy.wrap(firstItem).contains('Deleted')
        })
    }

    validate(fieldName: FieldName) {
        cy.get(`#bankaccount-${fieldName}-input`).invoke('val').then($val => {
            const input = $val as Input
            
            if (fieldName === "bankName") {
                if (input.length === 0) {
                    this.elements.hintBankName().should('have.text', messages.bankName.empty)
                } else if (input.length < 5) {
                    this.elements.hintBankName().should('have.text', messages.bankName.minlength)
                } else 
                    this.elements.hintBankName().should('not.exist')
            } else if (fieldName === "routingNumber") {
                if (input.length === 0) {
                    this.elements.hintRoutingNr().should('have.text', messages.routingNumber.empty)
                } else if (input.length === 9) {
                    this.elements.hintRoutingNr().should('not.exist')
                } else 
                this.elements.hintRoutingNr().should('have.text', messages.routingNumber.range)
            } else if (fieldName === "accountNumber") {
                if (input.length === 0) {
                    this.elements.hintAccountNr().should('have.text', messages.accountNumber.empty)
                } else if (input.length < 9) {
                    this.elements.hintAccountNr().should('have.text', messages.accountNumber.minlength)
                } else if (input.length > 12) {
                    this.elements.hintAccountNr().should('have.text', messages.accountNumber.maxlength)
                } else 
                this.elements.hintAccountNr().should('not.exist')
            }
        })
    }
}


type Input = string
type Field = {
    bankName?: string, 
    routingNumber?: string, 
    accountNumber?: string
}
type FieldName = "bankName" | "routingNumber" | "accountNumber"

export const bankAccounts = new BankAccounts()
