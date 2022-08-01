import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database.js";
import { jest } from "@jest/globals";
import scenarioFactory from "../factory/scenarioFactory.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import createRecommendationFactory, { recommendationData } from "../factory/createRecommendationFactory.js";
import { recommendationService } from "../../src/services/recommendationsService.js";

beforeEach(async () => {
    await scenarioFactory.resetDatabase();
});

describe("create recommendations", () => {
    it ("should receive recommendation data and create", async () => {
        const recommendation = createRecommendationFactory.createRecommendationData();

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(() : any=> {});
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce(() : any=> {});

        await recommendationService.insert(recommendation);

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    });

    it ("should receive repeat recommendation data and not create", async () => {
        const recommendation = createRecommendationFactory.createRecommendationData();

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(() : any=> {return recommendation});

        const request = recommendationService.insert(recommendation);
        expect(request).rejects.toEqual({type: "conflict", message: "Recommendations names must be unique"});
    });
});

describe("create upvote recommendation", () => {
    it ("should receive id recommendation and create upvote", async () => {
        const recommendation = await createRecommendationFactory.createRecommendationAndReturnData();

        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendation);
        jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce(recommendation);

        await recommendationService.upvote(recommendation.id);

        expect(recommendationRepository.updateScore).toHaveBeenCalled();
    });

    it ("should receive invalid recommendation and not create upvote", async () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(undefined);
        
        const request = recommendationService.upvote(undefined);

        expect(request).rejects.toEqual({type: "not_found", message: ""});
    });
});

describe("create downvote recommendation", () => {
    it ("should receive id recommendation and create downvote", async () => {
        const recommendation = await createRecommendationFactory.createRecommendationAndReturnData();

        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendation);
        jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce(recommendation);

        await recommendationService.downvote(recommendation.id);

        expect(recommendationRepository.updateScore).toHaveBeenCalled();
    });

    it ("should receive invalid recommendation and not create downvote", async () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(undefined);
        
        const request = recommendationService.downvote(undefined);

        expect(request).rejects.toEqual({type: "not_found", message: ""});
    });

    it ("should receive less than -5 downvote and delete recommendation",async () => {
        let recommendation = await createRecommendationFactory.createRecommendationAndReturnData();
        recommendation = { ...recommendation, score: -6 };
        
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendation);
        jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce(recommendation);
        jest.spyOn(recommendationRepository,"remove").mockImplementationOnce(undefined);

        await recommendationService.downvote(recommendation.id)
        expect(recommendationRepository.remove).toHaveBeenCalled();
    });
});

describe("get recommendations", () => {
    it ("should return recommendations", async () => {
        const recommendations = await createRecommendationFactory.createManyRecommendation(10);

        jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce(recommendations);
        
        await recommendationService.get();

        expect(recommendationRepository.findAll).toHaveBeenCalled();
    });
});