import { Recommendation } from "@prisma/client";
import { prisma } from "../../src/database.js";
import createRecommendationFactory from "../factory/createRecommendationFactory.js";
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
    it("given valid id, should create a upvote", async () => {
        let recommendation: Recommendation= await createRecommendationFactory.createRecommendation();

        const response = await agent.post(`/recommendations/${recommendation.id}/upvote`);

        let result = await prisma.recommendation.findFirst({
            where: {
                id: recommendation.id
            }
        });

        expect(response.statusCode).toBe(200);
        expect(result.score).toBe(recommendation.score+1);
    });

    it("given invalid id, should return 404", async () => {
        const id = "500000";
        const response = await agent.post(`/recommendations/${id}/upvote`);

        expect(response.statusCode).toBe(404);
    });
});

describe("Post downvote", () => {
    it("given valid id, should create a upvote", async () => {
        let recommendation: Recommendation= await createRecommendationFactory.createRecommendation();

        const response = await agent.post(`/recommendations/${recommendation.id}/downvote`);

        let result = await prisma.recommendation.findFirst({
            where: {
                id: recommendation.id
            }
        });

        expect(response.statusCode).toBe(200);
        expect(result.score).toBe(recommendation.score-1);
    });

    it("given invalid id, should return 404", async () => {
        const id = "500000";
        const response = await agent.post(`/recommendations/${id}/downvote`);

        expect(response.statusCode).toBe(404);
    });
});

describe("Get recommendations", () => {
    it("should return recommendations", async () => {
        await createRecommendationFactory.createManyRecommendation(10);

        const response = await agent.get(`/recommendations`);

        expect(response.statusCode).toBe(200);
        expect(response.text).not.toBeNull();
    });
});

describe("Get recommendations by id", () => {
    it("given valid id, should return recommendation", async () => {
        const recommendation = await createRecommendationFactory.createRecommendation();

        const response = await agent.get(`/recommendations/${recommendation.id}`);

        expect(response.statusCode).toBe(200);
        expect(response.text).not.toBeNull();
    });

    it("given invalid id, should 404", async () => {
        const id = "500000";
        const response = await agent.get(`/recommendations/${id}`);

        expect(response.text).not.toBeNull();
        expect(response.statusCode).toBe(404)
    });
});

describe("Get recommendations at random", () => {
    it("should return a recommendation", async () => {
        await createRecommendationFactory.createManyRecommendation(10);

        const response = await agent.get(`/recommendations/random`);

        expect(response.statusCode).toBe(200);
        expect(response.text).not.toBeNull();
    });

    it("should return 404, when doesn't exist recommendations", async () => {
        await scenarioFactory.resetDatabase();
        const response = await agent.get(`/recommendations/random`);

        expect(response.statusCode).toBe(404)
    });
});

describe("Get recommendations sorted by score ", () => {
    it("should return recommendations", async () => {
        const limit = 10;
        await createRecommendationFactory.createManyRecommendation(15);

        const response = await agent.get(`/recommendations/top/${limit}`);

        expect(response.text).not.toBeNull();
        expect(response.statusCode).toBe(200);
    });
});

afterAll(async () => {
    await scenarioFactory.resetDatabase();
    await prisma.$disconnect();
});