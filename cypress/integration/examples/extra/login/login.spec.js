describe('User login page', () => {
    it('Check correct input', () => {
        //Vist login page
        cy.visit('http://localhost:3000/user/login')

        //Check input of email field
        cy.get('#email').type("test@gmail.com")

        //Check input of email field
        cy.get('#password').type("Dev@12345")
    })

    it('Check wrong email id', () => {
        //Vist login page
        cy.visit('http://localhost:3000/user/login')

        //Check input of email field
        cy.get('#email').type("test")

        //Check input of email field
        cy.get('#password').type("Dev@12345")
    })

    it('Check wrong password', () => {
        //Vist login page
        cy.visit('http://localhost:3000/user/login')

        //Check input of email field
        cy.get('#email').type("test")

        //Check input of email field
        cy.get('#password').type("De")
    })
})