import * as authN from './../../fixtures/authN.json'
import * as statusCodes from './../../fixtures/statusCodes.json'
import * as data from '../../fixtures/transactionsData.json'
import { transactionFlow } from '../../pageObjects/Transactions'


describe("User makes a full transaction flow", () => {
    beforeEach(() => {
        cy.task("db:seed")
        cy.loginUI(authN.username, authN.password, statusCodes.OK)
    })
    
    it("Payment - round amount", () => {
        transactionFlow
            .makeTransaction(
                data.payment1.type,
                data.payment1.receiver,
                data.payment1.amount,
                data.payment1.note
                )
    })

    it("Payment - with decimals", () => {
        transactionFlow
            .makeTransaction(
                data.payment2.type,
                data.payment2.receiver,
                data.payment2.amount,
                data.payment2.note
                )
    })

    it("Request - default", () => {
        transactionFlow
            .makeTransaction(
                data.request.type,
                data.request.receiver,
                data.request.amount,
                data.request.note
                )
    })
})
