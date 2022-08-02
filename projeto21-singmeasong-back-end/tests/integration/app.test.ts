import { Recommendation } from "@prisma/client";
import { prisma } from "../../src/database.js";
import createRecommendationFactory, { recommendationData } from "../factory/createRecommendationFactory.js";
import scenarioFactory, { agent } from "../factory/scenarioFactory.js"

beforeEach(async () => {
    await scenarioFactory.resetDatabase();
});

describe("Post recommendation", () => {
    it("given name and youtube link, should create a recommendation", async () => {
        const recommendation : Recommendation = createRecommendationFactory.createRecommendationData(1);
        delete recommendation.score;
        delete recommendation.id;

        const response = await agent.post("/recommendations").send(recommendation);

        const result = await prisma.recommendation.findFirst({
            where: recommendation
        });

        expect(response.statusCode).toBe(201);
        expect(result).not.toBeNull();
    });

    it("given repit name and youtube link, should return 409", async () => {
        const recommendation : Recommendation = createRecommendationFactory.createRecommendationData(1);
        delete recommendation.score;
        delete recommendation.id;

        await agent.post("/recommendations").send(recommendation);
        const response = await agent.post("/recommendations").send(recommendation);
        expect(response.statusCode).toBe(409);
    });

    it("given invalid data, should return 422", async () => {
        const recommendation: Partial<Recommendation> = {name: "", youtubeLink: ""};

        const response = await agent.post("/recommendations").send(recommendation);

        expect(response.statusCode).toBe(422);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});