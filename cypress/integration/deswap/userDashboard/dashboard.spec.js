/// <refrence types="Cypress" />

import UserDashboard from "../pageObjectsModal/userDashboard";
import LoginPage from "../pageObjectsModal/loginPage";

describe("Deswap Dashboard", () => {
    beforeEach(() => {
    cy.viewport("macbook-15");
    const lp = new LoginPage();
    lp.visit();
    lp.launchButton();
    lp.fillEmail("shivamlaxminetworks@gmail.com");
    lp.fillPassword("Dev@12345");
    lp.submit();
    cy.request({
      url: "http://localhost:3000/_next/data/development/user/verification.json",
      method: "GET",
    })
      .should((response) => {
        expect(response.status).to.eq(200);
      })
      .then(() => {
        cy.log("done");
      })
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/user/verification");
      })
      .then(() => {
        cy.get(".backBtn").click();
      })
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/user/dashboard");
      });
  });

  it("Go to Profile page", () => {
      cy.get('.sidebar-links li a').contains('Profile').click()
  });
//   it("Go to Buy Deswap Page", () => {
//       cy.get('.sidebar-links li a').contains('Buy Deswap').click()
//   });
//   it("Go to Metaverse page", () => {
//       cy.get('.sidebar-links li a').contains('Metaverse').click()
//   });
//   it("Go to NFT License page", () => {
//       cy.get('.sidebar-links li a').contains('NFT License').click()
//   });
//   it("Go to Buy Deswap page", () => {
//       cy.get('.sidebar-links li a').contains('Buy Deswap').click()
//   });
//   it("Go to Network page", () => {
//       cy.get('.sidebar-links li a').contains('Network').click()
//   });
//   it("Go to My Network page", () => {
//       cy.get('.sidebar-links li a').contains('My Network').click()
//   });
//   it("Go to Create Token page", () => {
//       cy.get('.sidebar-links li a').contains('Create Token').click()
//   });
});
