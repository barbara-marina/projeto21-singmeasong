Cypress.Commands.add("downvote", (user) => {
    cy.request("POST", "/recommendations/1/downvote", user).then(res => {
            cy.log(res);
    });
});