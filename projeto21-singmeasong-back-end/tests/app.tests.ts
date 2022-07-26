import { prisma } from "../src/database.js";
import scenarioFactory, { agent } from "./factory/scenarioFactory.js";

beforeEach(async () => {
    await prisma.recommendation.deleteMany({});
});

describe("Post recommendation", () => {
    it("given name and youtube link, should create a recommendation", async () => {
        const recommendation = await scenarioFactory.createOneRecommendation();

        const response = await agent.post("/recommendations").send(recommendation);
        expect(response.statusCode).toBe(201);
    })
});

describe("Get recommendtation", () => {
    it("get recommendation, should create a recommendation", async () => {
        scenarioFactory.createRecommendation();
        scenarioFactory.createRecommendation();
        scenarioFactory.createRecommendation();

        const response = await agent.get("/recommendations");
        expect(response.statusCode).toBe(201);
    })
});

afterAll(async () => {
    await prisma.$disconnect();
});