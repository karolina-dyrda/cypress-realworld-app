import * as authN from './../../fixtures/authN.json'
import * as statusCodes from './../../fixtures/statusCodes.json'
import * as accountData from './../../fixtures/accountData.json'
import { settings } from '../../pageObjects/Settings'

describe("Update user's personal data", () => {

    beforeEach(() => {
        cy.task("db:seed")
        cy.loginUI(authN.username, authN.password, statusCodes.OK)
    })

    it("Change first name and last name", () => {
        settings.updateData( { 
            "firstName": accountData.user.firstName,
            "lastName": accountData.user.lastName
        } )
    })

    it("Change email", () => {
        settings.updateData( { 
            "email": accountData.user.email
        } )

    })

    it("Change phone number", () => {
        settings.updateData( { 
            "phone": accountData.user.phone
        } )
    })

    
    it("Change all fields: first name, last name, email, phone", () => {
        settings.updateData(accountData.user)
    })

})
