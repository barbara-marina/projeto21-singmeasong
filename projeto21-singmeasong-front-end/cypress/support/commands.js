const URL_API = "http://localhost:5000"
const URL = "http://localhost:3000"

Cypress.Commands.add("resetDatabase", () => {
    cy.request("DELETE", `${URL_API}/reset`).then(res => {
            cy.log(res);
    });
});


Cypress.Commands.add("createRecommendation", recommendation => {
    cy.get("input[placeholder='Name']").type(recommendation.name);
    cy.get("input[placeholder='https://youtu.be/...']").type(recommendation.youtubeLink);

    cy.intercept("POST", `${URL_API}/recommendations`).as("createRecommendation");
    cy.get("button").click();
    cy.wait("@createRecommendation");
});