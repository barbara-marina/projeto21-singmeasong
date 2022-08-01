import { faker } from "@faker-js/faker";
const URL_API = "http://localhost:5000"
const URL = "http://localhost:3000"

Cypress.Commands.add("resetDatabase", () => {
    cy.request("DELETE", `${URL_API}/reset`).then(res => {
            cy.log(res);
    });
});


Cypress.Commands.add("createRecommendation", () => {
    const recommendation = {
        name: faker.lorem.words(3),
        youtubeLink: "https://www.youtube.com/watch?v=tMgi_Wlzgew"
    };

    cy.get("input[placeholder='Name']").type(recommendation.name);
    cy.get("input[placeholder='https://youtu.be/...']").type(recommendation.youtubeLink);

    cy.intercept("POST", `${URL_API}/recommendations`).as("recommendation");
    cy.get("button").click();
    cy.wait("@recommendation");

    return cy.wrap(recommendation.name);
});

Cypress.Commands.add("createUpvote", (id) => {
    cy.get("article:first").within(() => {
        cy.get("svg:first").click().wait(2000);
    })
});


Cypress.Commands.add("createDownvote", (id) => {
    cy.get("article:last").within(() => {
        cy.get("svg:last").click().wait(2000);
    })
});