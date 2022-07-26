import app from "../../src/app.js";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import { prisma } from "../../src/database.js";
import { Recommendation } from "@prisma/client";

type recommendationData = Omit<Recommendation, "id" | "score">;
const agent = supertest.agent(app);

function createOneRecommendation() {
    return {
        name: faker.name.findName(),
        youtubeLink: "https://www.youtube.com/watch?v=Zi7OXmTmgGg&t=198s"
    }
}
async function createRecommendation() {
    const recommendation: recommendationData = createOneRecommendation();

    await prisma.recommendation.create({
        data: recommendation
    });
}

const scenarioFactory = {
    createRecommendation
};

export default scenarioFactory;