/// <refrence types="Cypress" />

class UserDashboard
{
    visit()
    {
        cy.visit("/user/dashboard")
    }
}

export default UserDashboard