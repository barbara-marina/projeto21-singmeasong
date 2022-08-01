const URL_API = "http://localhost:5000"

Cypress.Commands.add("resetDatabase", () => {
    cy.log("reseting recommendations");
    cy.request("DELETE", `${URL_API}/reset`).then(res => {
            cy.log(res);
    });
});