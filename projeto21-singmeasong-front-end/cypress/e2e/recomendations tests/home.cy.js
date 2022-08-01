/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

const URL = "http://localhost:3000";
const URL_API = "http://localhost:5000";

beforeEach(() => {
    cy.resetDatabase();
});

describe("home", () => {
    it ("should navigate to /", () => {
        cy.visit("/");
        cy.url().should("equal", `${URL}/`);
        cy.get("input").should("be.visible");
    });

    it("should create recommendation", () => {

        cy.visit("/");

        for (let i = 0; i < 3; i++) {
            const recommendation = {
                name: faker.lorem.words(3),
                youtubeLink: "https://www.youtube.com/watch?v=tMgi_Wlzgew"
            };

            cy.createRecommendation(recommendation);
            cy.contains(recommendation.name);
        }
    });
});