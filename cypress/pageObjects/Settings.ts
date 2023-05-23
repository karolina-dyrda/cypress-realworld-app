class Settings {
    inputs: Record<InputName, string> = {
        firstNameInput: '[data-test="user-settings-firstName-input"]',
        lastNameInput: '[data-test="user-settings-lastName-input"]',
        emailInput: '[data-test="user-settings-email-input"]',
        phoneInput: '[data-test="user-settings-phoneNumber-input"]'
    }
    submitBtn = '[data-test="user-settings-submit"]'
    fullName = '[data-test="sidenav-user-full-name"]'
    
    openPage() {
        cy.sideNavi('user-settings')
        cy.url().should('include', '/user/settings')
        return this
    }

    editData(fields: Fields) {
        Object.keys(fields).forEach(field => {
            const fieldName = field as FieldName;
            const fieldValue = fields[fieldName];
            const inputName = FieldsNameToInputsNameMap[fieldName];

            if (fieldValue) {
                const inputSelector = this.inputs[inputName];
                cy.get(inputSelector).clear().type(fieldValue)
            }
        })
        return this
    }

    saveForm() {
        cy.intercept('PATCH', '/users/*').as('updateUser')      
        cy.intercept('GET', 'checkAuth').as('getUser')
        cy.get(this.submitBtn).click()
        cy.wait('@updateUser')
        cy.wait('@getUser')
        return this
    }

    validateUpdatedData(fields: Fields) {
        Object.keys(fields).forEach(field => {
            const fieldName = field as FieldName;
            const fieldValue = fields[fieldName];
            const inputName = FieldsNameToInputsNameMap[fieldName];

            if (fieldValue) {
                const inputSelector = this.inputs[inputName];
                cy.get(inputSelector).should('have.value', fieldValue)

                if (fieldName === "firstName") {
                    cy.get(this.fullName).then($fullName => {
                            expect($fullName.text()).to.include(fieldValue)
                    })
                }

                if (fieldName === "lastName") {
                    cy.get(this.fullName).then($fullName => {
                            expect($fullName.text()).to.include(fieldValue.substring(0,1))
                    })
                }
            }
        })
    }

    updateData(fields: Fields) {
        this.openPage().editData(fields).saveForm().validateUpdatedData(fields)
    }
}

type InputName = "firstNameInput" | "lastNameInput" | "phoneInput" | "emailInput";
type FieldName = "firstName" | "lastName" | "phone" | "email";
type Fields = {
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,
};

const FieldsNameToInputsNameMap: Record<FieldName, InputName> = {
    firstName: "firstNameInput",
    lastName: "lastNameInput",
    phone: "phoneInput",
    email: "emailInput"
};

export const settings = new Settings()
