/// <refrence types="Cypress" />

class LoginPage
{
    visit()
    {
        cy.visit("/")
    }
    launchButton()
    {
        cy.get("nav button").contains("Launch App").click()
    }
    fillEmail(value)
    {
        const field = cy.get("#email")
        field.clear()
        field.type(value)
        return this
    }
    // return this shows its a class method
    fillPassword(value)
    {
        const field = cy.get("#password")
        field.clear()
        field.type(value)
        return this
    }
    submit()
    {
        const button = cy.get(".formInputs").contains("Login")
        button.click()
    }
}

export default LoginPage