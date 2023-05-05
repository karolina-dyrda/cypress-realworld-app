import * as authZ from './../../fixtures/authZ.json'
import * as statusCodes from './../../fixtures/statusCodes.json'

describe('Log in using UI', () => {
    it('Log in with correct credentials', () => {
        cy.loginUI(authZ.username, authZ.password, statusCodes.OK)
    })

    it('Log in with incorrect credentials', () => {
        cy.loginUI(authZ.username, authZ.incorrectPassword, statusCodes.Unauthorized)
    })
});
