import * as authN from './../../fixtures/authN.json'
import * as statusCodes from './../../fixtures/statusCodes.json'

describe('Authentication via user interface', () => {
    it('Log in with correct credentials', () => {
        cy.loginUI(authN.username, authN.password, statusCodes.OK)
    })

    it('Log in with incorrect credentials', () => {
        cy.loginUI(authN.username, authN.incorrectPassword, statusCodes.Unauthorized)
    })

    it('Log out', () => {
        cy.loginUI(authN.username, authN.password, statusCodes.OK)
        cy.logoutUI()
    })
});
