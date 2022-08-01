import { faker } from "@faker-js/faker";

const URL_API = "http://localhost:5000"
const URL = "http://localhost:3000"

Cypress.Commands.add("resetDatabase", () => {
    cy.request("DELETE", `${URL_API}/reset`).then(res => {
            cy.log(res);
    });
});


Cypress.Commands.add("createRecommendation", type => {
    const recommendation = {
        name: `Halloween Special ${faker.lorem.words(1)}`,
        youtubeLink: "https://www.youtube.com/watch?v=tMgi_Wlzgew"
    };

    if (type === "first") {
        recommendation.name = "Halloween Special";
    }

    cy.get("input[placeholder='Name']").type(recommendation.name);
    cy.get("input[placeholder='https://youtu.be/...']").type(recommendation.youtubeLink);

    cy.intercept("POST", `${URL_API}/recommendations`).as("recommendation");
    cy.get("button").click();
    cy.wait("@recommendation");

    return cy.wrap(recommendation.name);
});

Cypress.Commands.add("createUpvote", () => {
    cy.get("article:first").within(() => {
        cy.get("svg:first").click().wait(5000);
    })
});


Cypress.Commands.add("createDownvote", () => {
    cy.get("article:last").within(() => {
        cy.get("svg:last").click().wait(5000);
    })
});