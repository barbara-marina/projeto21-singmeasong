/// <reference types="cypress" />

const URL = "http://localhost:3000";
const URL_API = "http://localhost:5000";

before(() => {
    cy.resetDatabase();
    cy.visit("/");
    for (let i = 0; i < 5; i++) {
        cy.createRecommendation();
    }
});

describe("random", () => {
    it ("should navigate to /random", () => {
        cy.contains("Random").click();
        cy.url().should("equal", `${URL}/random`);
    });

    it ("should any recommendation", () => {
        cy.get("article:first").should("be.visible");
    });
});