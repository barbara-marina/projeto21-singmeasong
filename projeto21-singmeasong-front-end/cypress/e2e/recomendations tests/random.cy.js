/// <reference types="cypress" />

const URL = "http://localhost:3000";
const URL_API = "http://localhost:5000";

before(() => {
    cy.resetDatabase();
});

describe("random", () => {
    it ("should navigate to /random", () => {
        cy.visit("/");
        cy.contains("Random").click();
        cy.url().should("equal", `${URL}/random`);
    });
});