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
        const data = createRecommendationFactory.createRecommendationData();

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(() : any=> {});
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce(() : any=> {});

        await recommendationService.insert(data);

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    })

    it ("should receive repeat recommendation data and not create", async () => {
        const data = createRecommendationFactory.createRecommendationData();

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(() : any=> {return data});

        const request = recommendationService.insert(data);
        expect(request).rejects.toEqual({type: "conflict", message: "Recommendations names must be unique"});
    })
});

describe("create upvote recommendation", () => {
    it ("should receive id recommendation and create upvote", async () => {
        const data = await createRecommendationFactory.createRecommendationAndReturnData();

        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(data);
        jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce(data);

        await recommendationService.upvote(data.id);

        expect(recommendationRepository.updateScore).toHaveBeenCalled();
    })
});