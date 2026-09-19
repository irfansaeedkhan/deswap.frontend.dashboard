/// <refrence types="Cypress" />

import LoginPage from "./pageObjectsModal/loginPage";
describe("Deswap Login", () => {
  it("login deswap", () => {
    // fetch methods of class
    const lp = new LoginPage();
    lp.visit();
    lp.launchButton();
    lp.fillEmail("shivamlaxminetworks@gmail.com");
    lp.fillPassword("Dev@12345");
    lp.submit();
  });
});
