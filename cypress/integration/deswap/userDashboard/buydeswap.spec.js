///  <refrence types="Cypress"/>

describe("Buy Deswap Page", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/user/dashboard/buydswap");
    });
    it("connect wallet", () => {
      cy.get(".DashboardNavbarContainer .textBox button").contains("Connect").click();
    //   cy.get("#PackName").type("packname1");
    //   cy.get(".createdeswapstackCard #Amount").type(45);
    //   cy.get(".createdeswapstackCard input[name=LockedPeriod]").type(12);
    //   cy.get(".createdeswapstackCard input[name=LockedPeriodType]").type("months");
    //   cy.get(".createdeswapstackCard input[name=Bonous]").type(0.5);
    //   cy.get('.createdeswapstackCard .footerCard button').contains('Create').should('be.visible').should('be.enabled').click()
    });
  });