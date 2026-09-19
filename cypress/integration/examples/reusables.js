///  <refrence types="Cypress"/>

// const { logLines } = require("cypress/lib/logger")

// some learning materials
// we can also gives more time to delay by default its 4sec
// selecting specific button which has sepecfic value 
// .addtoCart[value='add to cart']

// cy.get('input[name=userName]').should('be.visible').should('be.enabled').type('abcs');

// title verification
// cy.title().should('eq', "my custom title");

// checking radio buttons

// cy.get('input[value:desighee]').should('be.visible').should('be.checked')
// cy.get('input[value:murghi]').should('be.visible').should('not.be.checked').click()

// // checking tick on checkboxes
// positive validation
// cy.get('#checkbox1').check().should('be.checked').and('have.value', 'Cricket');
// cy.get('#checkbox1').check().should('be.checked').and('have.value', 'Movies');
// negative validation
// cy.get('#checkbox1').uncheck().should('not.be.checked').and('have.value', 'Cricket');
// cy.get('#checkbox1').uncheck().should('not.be.checked').and('have.value', 'Movies');

//  select multiple checkboxes in one line using array
//  it will only cjeck cricket nd hoecky from whole list
// cy.get('input[type=checkbox]').check(['Cricket', 'Hockey']);

// selecting drop down

// cy.get('#abcd').select('android').should('have.value','android')

// multiple selector list languAGES
// cy.get('#abcd').contains('English').click();
// cy.get('#abcd').contains('Urdu').click();

// searchsblr dropdown where you click ,type and enter

// cy.get('[role=combobox]').click()
// cy.get('.select-searchfield').type('Pakistan')
// cy.get('.select-searchfield').type('{enter}') // press enter key

//  if some click is not working because its hidden behind use force
// cy.get('[role=combobox]').click({force: true})


// to check alert message
// cy.on('window:alert', (str) => {
//     expect(str).to.equal('plz enter code')
// })

//  navigation between pages

// it('navigation betwen pages', function(){
// //    going home and checking title
//     cy.visit('home.com')
//     cy.title().should('eq', 'home title of page') //home

//     // going to second page nd checking title
//     cy.get('.registerBtn').contains('Reg').click()
//     cy.title().should('eq', 'register title of page') //regoister

//     // let go back to home page by using go
//     cy.go('back')
//     cy.title().should('eq', 'home title of page') //home

//     // and also move forwrd
//     cy.go('forward')
//     cy.title().should('eq', 'register title of page') //regoister
// })

// cy.reload() // to reload the page


//  table test scenarios

// it('test tables', () =>{
// //    check word selenium in all td's
// cy.get('table[name=customtable]').contains('td', 'selenium').should('be.visible')
// // now on specific row and column check wahter irfan is present or not
// cy.get('table > tbody > tr:nth-child(1) > td:nth-child(4)').contains('selenium').should('be.visible')


// a special for case using each and then
// a value from all rows on third column which is car check the first column if it bmw , so loop through column 2 get the value and the number of row which might be 3rd search the column 1 till the 3rd row and confirm it has bmw value

// cy.get('table[name=customtable] > tbody > tr td:nth-child(2)').each(($e, index, $list) => {
//     // get the text value
//     const text = $e.text()
//     if(text.includes("car")){
//         cy.get('table[name=customtable] > tbody > tr td:nth-child(1)').eq(index).then(function(cname){
//             // get the name of first column column with same row
//             const bookName = cname.text()
//             expect(bookName).to.equal('bmw')
//         })
//     }
// }) 

// before and after each to avoid repeating same code to perform before each it
//   describe('test suit', () =>{
//     before(() => {
//         // runs once before all tests in the block
//         cy.log('setup everything code')
//       })
    
//       beforeEach(() => {
//         // runs before each test in the block
//         cy.log('login code')
//       })
    
//       afterEach(() => {
//         // runs after each test in the block
//         cy.log('logout code')
//       })
    
//       after(() => {
//         // runs once after all tests in the block
//         cy.log('closing everything code')
//       })
//       it('searching', () =>{
//           cy.log('searching test')
//       })
//       it('advance searching', () =>{
//         cy.log('advance searching test')
//       })
//       it('listing products', () =>{
//         cy.log('listing test')
//       })
//   })

// })

// //   using fixturess

//   describe('fixtures', () =>{
//     before(() => {
//         // runs once before all tests in the block
//         // get the data frm=om file login 
//         // use this keyword to get and use data outside of the block
//         cy.fixture('login').then( function(data){
//             // now this.data has the fixtrues file data
//                 this.data = data;
//         })
//       })

//       it('using fixtrues data', () =>{
//           cy.get('input').type(this.data.email)
//       })

//     })

//   using commands

// describe('reusable commands', () =>{

//       it('edit user after login', () =>{
//         //   here we can use that command u put in support command.js
//         cy.login('customUsername', 'custompass')
//           cy.log('edit user')
// put wrong email and test
        //   cy.login('customUsername23', 'custompass45')
//           cy.log('edit user') title should not be the same for wrong input etc
//       })
//       it('delete user after login', () =>{
//         cy.login('customUsername', 'custompass')
//         cy.log('delete user')
//       })

//     })


//  page object model pattern to make clases of the methods and selectors make folder named pageObjects in integrations and inside files
/// <refrence types="Cypress" />

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
// import that class
// import LoginPage from '../../pageObjects/loginPage'
// describe('using class methods', () =>{

//       it('valid  login test', () =>{
//         // fetch methods of class
//         const lp = new LoginPage()
//         // now just by using reusalbe function i can write my test saving time
//         lp.visit()
//         lp.fillEmail('myemail@gmail.com')
//         lp.fillPW('secretone')
//         lp.submit()
//       })
//     })

// setting viewport
// cy.viewport('macbook-15')
// add waiting
// cy.wait(2000)



//   cy.location("href").should("contain", "/verification");
// cy.visit('http://localhost:3000/user/verification')


  //   cy.on("url:changed", () => {
  //     cy.location("href").should("contain", "user/verification");
  //   });
  //   cy.visit('http://localhost:3000/user/verification')
  // cy.on('url:changed', url => {
  //     cy.location('hash').then(hash => {
  //         if (!url.endsWith(hash)) {
  //             cy.visit(url);
  //         }
  //     });
  // });

  // cy.visit("http://localhost:3000/user/verification")
  // it('cy.request() - make an XHR request', () => {
  //     // https://on.cypress.io/request
  //     cy.request('https://jsonplaceholder.cypress.io/comments')
  //      .should((response) => {
  //       expect(response.status).to.eq(200)
  //       expect(response.body).to.have.length(500)
  //       expect(response).to.have.property('headers')
  //       expect(response).to.have.property('duration')
  //      })
  //    })

//   describe("CRUD Operation on Deswap Packs", () => {
//     beforeEach(() => {
//       cy.visit("http://localhost:3000/admin/dashboard/addclamingpack");
//     });
//     it("creates deswap pack", () => {
//       cy.get(".adminDashboard button p").contains("Deswap Pack").click();
//       cy.get("#PackName").type("packname1");
//       cy.get(".createdeswapstackCard #Amount").type(45);
      // cy.get("#LockedPeriod").type("12");
      // cy.get("#LockedPeriodType").type("montha");
      // cy.get("#Bonous").type("43%");
      // cy.get(".footerCard button").contains("Create").click();
  
      
      // cy.get("nav button").contains("Launch App").click();
      // cy.fixture("login")
      //   .as("credentials")
      //   .then((credentials) => {
      //     cy.get("#email").type(credentials.email);
      //     cy.get("#password").type(credentials.password);
      //   });
      // cy.get(".formInputs").contains("Login").click();
      // cy.request({
      //   url: "/_next/data/development/user/verification.json",
      //   method: "GET",
      // }).should((response) => {
      //   expect(response.status).to.eq(200);
      // });
      
    // });
  
  //   cy.location("href").should("contain", "/verification");
  // cy.visit('http://localhost:3000/user/verification')
  
  
    //   cy.on("url:changed", () => {
    //     cy.location("href").should("contain", "user/verification");
    //   });
    //   cy.visit('http://localhost:3000/user/verification')
    // cy.on('url:changed', url => {
    //     cy.location('hash').then(hash => {
    //         if (!url.endsWith(hash)) {
    //             cy.visit(url);
    //         }
    //     });
    // });
  
    // cy.visit("http://localhost:3000/user/verification")
    // it('cy.request() - make an XHR request', () => {
    //     // https://on.cypress.io/request
    //     cy.request('https://jsonplaceholder.cypress.io/comments')
    //      .should((response) => {
    //       expect(response.status).to.eq(200)
    //       expect(response.body).to.have.length(500)
    //       expect(response).to.have.property('headers')
    //       expect(response).to.have.property('duration')
    //      })
    //    })
//   });
  


//  login test spec js
// getting variable from cypress.json
const SomeValue = Cypress.env("somevalue");

describe("Deswap Login", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("redirects to login page then put credentials", () => {
    cy.get("nav button").contains("Launch App").click();
    cy.fixture("login")
      .as("credentials")
      .then((credentials) => {
        cy.get("#email").type(credentials.email);
        cy.get("#password").type(credentials.password);
      });
    cy.get(".formInputs").contains("Login").click();
    cy.request({
      url: "/_next/data/development/user/verification.json",
      method: "GET",
    }).should((response) => {
      expect(response.status).to.eq(200);
    });
    
  });
});
