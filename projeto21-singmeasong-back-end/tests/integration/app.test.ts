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

describe("Post upvote", () => {
    it("given name and youtube link, should create a recommendation", async () => {
        let recommendation: Recommendation= await createRecommendationFactory.createRecommendation();

        const response = await agent.post(`/recommendations/${recommendation.id}/upvote`);

        let result = await prisma.recommendation.findUnique({
            where: {
                id: recommendation.id
            }
        });

        expect(response.statusCode).toBe(200);
        expect(result.score).toBe(recommendation.score+1);
    });

    it("given name and youtube link, should create a recommendation", async () => {
        const id = "500000";
        const response = await agent.post(`/recommendations/${id}/upvote`);

        expect(response.statusCode).toBe(404);
    });
});

describe("Post downvote", () => {
    it("given name and youtube link, should create a recommendation", async () => {
        let recommendation: Recommendation= await createRecommendationFactory.createRecommendation();

        const response = await agent.post(`/recommendations/${recommendation.id}/downvote`);

        let result = await prisma.recommendation.findUnique({
            where: {
                id: recommendation.id
            }
        });

        expect(response.statusCode).toBe(200);
        expect(result.score).toBe(recommendation.score-1);
    });

    it("given name and youtube link, should create a recommendation", async () => {
        const id = "500000";
        const response = await agent.post(`/recommendations/${id}/downvote`);

        expect(response.statusCode).toBe(404);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});