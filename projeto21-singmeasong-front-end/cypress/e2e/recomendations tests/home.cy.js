/// <reference types="cypress" />

const URL = "http://localhost:3000";
const URL_API = "http://localhost:5000";

before(() => {
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

        cy.createRecommendation().then(name => {
            cy.contains(name);
        });
    });

    it("should add upvote to recommendation", () => {
        cy.createUpvote().then(() =>{
            cy.get("article:last").within(() => {
                cy.get("div:last").invoke("text").then(text => {
                    cy.wrap(text).should("equal", "1");
                });
            });
        });
    });


    it("should add downvote to recommendation", () => {
        for (let i = 0; i < 2; i++) {
            cy.createDownvote().then(() =>{
                cy.get("article:last").within(() => {
                    cy.get("div:last").invoke("text").then(text => {
                        cy.wrap(text).should("equal", `${(-1)*i}`);
                    });
                });
            });
        }
    });

    it("should delete recommendation with score < -5", () => {
        for (let i = 0; i < 5; i++) {
            cy.createDownvote()
        }

        cy.get("div:last").invoke("text").then(text => {
            cy.wrap(text).should("equal", "No recommendations yet! Create your own :)");
        })
    });
})