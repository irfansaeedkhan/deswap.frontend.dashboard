// /// <refrence types="Cypress" />

// class LoginPage
// {
//     visit()
//     {
//         cy.visit("localhost:3000/")
//     }

//     fillEmail(value)
//     {
//         const field = cy.get('[id=Email]')
//         field.clear()
//         field.type(value)
//         return this
//     }
// // return this shows its a class method
//     fillPW(value)
//     {
//         const field = cy.get('[id=password]')
//         field.clear()
//         field.type(value)
//         return this
//     }

//     submit()
//     {
//         const button = cy.get('[id=submit]')
//         button.click()
//     }
// }

// export default LoginPage