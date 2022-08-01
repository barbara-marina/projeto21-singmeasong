/// <reference types="cypress" />

const URL = "http://localhost:3000";
const URL_API = "http://localhost:5000";
const upvoteAmount = 5;

before(() => {
    cy.resetDatabase();
    cy.visit("/");
    cy.createRecommendation("first");
    for (let i = 0; i < upvoteAmount; i++) {
        cy.createUpvote();
    }
    for (let i = 0; i < 2; i++) {
        cy.createRecommendation();
    }
});

describe("top", () => {
    it ("should navigate to /top", () => {
        cy.contains("Top").click();
        cy.url().should("equal", `${URL}/top`);
    });

    it ("should highest score recommendation is on top", () => {
        cy.get("article:first").within(() => {
            cy.get("div:last").invoke("text").then(text => {
                cy.wrap(text).should("equal", `${upvoteAmount}`);
            });
        });
    });
});