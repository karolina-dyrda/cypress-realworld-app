class TransactionFlow {

    elements = {
        newBtn: () => cy.get('[data-test="nav-top-new-transaction"]'),
        userSearch: () => cy.get('[data-test="user-list-search-input"]'),
        usersList: () => cy.get('[data-test="users-list"]'),
        userItem: (username: string) => cy.contains('[data-test="users-list"] li', username),
        amountInput: () => cy.get('[data-test="transaction-create-amount-input"]'),
        noteInput: () => cy.get('[data-test="transaction-create-description-input"]'),
        selectedUserDetails: () => cy.get('[data-test="selected-user"]'),
        requestBtn: () => cy.get('[data-test="transaction-create-submit-request"]'),
        payBtn: () => cy.get('[data-test="transaction-create-submit-payment"]'),
        userBalance: () => cy.get('[data-test="sidenav-user-balance"]').invoke('text')
    }

    createNew() {
        this.elements.newBtn().click()
        cy.url().should('include', '/transaction/new')
        return this
    }
    
    selectUser(receiver: string) {
        this.elements.userSearch().type(receiver)
        this.elements.userItem(receiver).click()
        this.elements.selectedUserDetails().invoke('text').should('include', receiver)
        return this
    }

    addDetails(amount: string, note: string) {
        this.elements.amountInput().type(amount)
        this.elements.noteInput().type(note)
            
    }

    request() {
        this.elements.requestBtn().click()
    }

    pay() {
        this.elements.payBtn().click()
    }

    checkConfirmationPage(type: Type, amount: string, note: string) {
        if (type === "request") {
            cy.get('h2')
                .should('contain', 'Requested')
                .and('contain', amount)
                .and('contain', note)
        } else
            cy.get('h2')
                .should('contain', 'Paid')
                .and('contain', amount)
                .and('contain', note)
    }

    makeTransaction(type: Type, receiver: string, amount: string, note: string) {
        cy.log("New transaction", {
            type, amount
        })
        this.createNew()
        this.selectUser(receiver)
        this.addDetails(amount, note)

        cy.intercept('POST', 'transactions').as('submitTransaction')
        cy.intercept('GET', 'checkAuth').as('updateUserData')

        this.elements.userBalance().then(initBal => {
            const initialBalance = Number(initBal.replace(/[^0-9\.]+/g,""))

            if (type === "request") {
                this.request()
            } else 
                this.pay()
            
            cy.wait('@submitTransaction')
            cy.wait('@updateUserData')

            
            this.elements.userBalance().then(curBal => {
                const currentBalance = Number(curBal.replace(/[^0-9\.]+/g,""))
                const transactionAmount = parseFloat(amount)
                let diff;
                if (type === "request") {
                    diff = initialBalance + transactionAmount
                } else 
                diff = initialBalance - transactionAmount
                
                cy.log("Balance log", {
                    "Transaction amount": transactionAmount,
                    "Transaction type": type,
                    "Initial balance": initialBalance,
                    "Current balance": currentBalance
                })
                
                this.checkConfirmationPage(type, amount, note)

                expect(currentBalance).to.eql(diff)

            })
        })
    }
}

type Type = "payment" | "request" | string

export const transactionFlow = new TransactionFlow()
