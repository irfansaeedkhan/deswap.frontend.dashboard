///  <refrence types="Cypress"/>

describe("CRUD Operation on Deswap Packs", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/admin/dashboard/addclamingpack");
  });
  it("creates deswap pack", () => {
    cy.get(".adminDashboard button p").contains("Deswap Pack").click();
    cy.get("#PackName").type("packname1");
    cy.get(".createdeswapstackCard #Amount").type(45);
    cy.get(".createdeswapstackCard input[name=LockedPeriod]").type(12);
    cy.get(".createdeswapstackCard input[name=LockedPeriodType]").type("months");
    cy.get(".createdeswapstackCard input[name=Bonous]").type(0.5);
    cy.get('.createdeswapstackCard .footerCard button').contains('Create').should('be.visible').should('be.enabled').click()
  });
});
