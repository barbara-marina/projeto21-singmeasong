import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import createRecommendationFactory from "../factory/createRecommendationFactory.js";
import { recommendationService } from "../../src/services/recommendationsService.js";

beforeEach(async () => {
    jest.clearAllMocks();
});

describe("create recommendations", () => {
    it ("should receive recommendation data and create", async () => {
        const recommendation = createRecommendationFactory.createRecommendationData(1);

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(() : any=> {});
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce(async () => {});

        await recommendationService.insert(recommendation);

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    });

    it ("should receive repeat recommendation data and not create", () => {
        const recommendation = createRecommendationFactory.createRecommendationData(1);

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(() : any=> {return recommendation});

        const request = recommendationService.insert(recommendation);

        expect(request).rejects.toEqual({type: "conflict", message: "Recommendations names must be unique"});
        expect(recommendationRepository.create).not.toBeCalled();
    });
});

describe("create upvote recommendation", () => {
    it ("should receive id recommendation and create upvote", async () => {
        const recommendation = createRecommendationFactory.createRecommendationData(1);

        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendation);
        jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce(recommendation);

        await recommendationService.upvote(recommendation.id);

        expect(recommendationRepository.updateScore).toHaveBeenCalled();
    });

    it ("should receive invalid recommendation and not create upvote", async () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(undefined);
        
        const request = recommendationService.upvote(undefined);

        expect(request).rejects.toEqual({type: "not_found", message: ""});
        expect(recommendationRepository.updateScore).not.toHaveBeenCalled();
    });
});

describe("create downvote recommendation", () => {

    it ("should receive id recommendation and create downvote", async () => {
        const recommendation = createRecommendationFactory.createRecommendationData(1);

        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendation);
        jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce(recommendation);

        await recommendationService.downvote(recommendation.id);

        expect(recommendationRepository.updateScore).toHaveBeenCalled();
    });

    it ("should receive invalid recommendation and not create downvote", () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(undefined);
        
        const request = recommendationService.downvote(undefined);

        expect(request).rejects.toEqual({type: "not_found", message: ""});
        expect(recommendationRepository.updateScore).not.toHaveBeenCalled();
    });

    it ("should receive less than -5 downvote and delete recommendation",async () => {
        const recommendation = createRecommendationFactory.createRecommendationData(1);
        recommendation.score = -6;

        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendation);
        jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce(recommendation);
        jest.spyOn(recommendationRepository, "remove").mockResolvedValueOnce(undefined);

        await recommendationService.downvote(recommendation.id);

        expect(recommendationRepository.remove).toHaveBeenCalled();
    });
});

describe("get recommendations", () => {
    it ("should return recommendations", async () => {
        const recommendations = await createRecommendationFactory.createManyRecommendationData(10);

        jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce(recommendations);
        
        await recommendationService.get();

        expect(recommendationRepository.findAll).toHaveBeenCalled();
    });
});

describe("get recommendations by id", () => {
    it ("should return recommendation by id, when it's valid", async () => {
        const recommendation = createRecommendationFactory.createRecommendationData(1);

        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendation);
    
        await recommendationService.getById(recommendation.id);

        expect(recommendationRepository.find).toHaveBeenCalled();
    });

    it ("should return error when id is invalid", async () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
        
        const request = recommendationService.getById(1);

        expect(request).rejects.toEqual({type: "not_found", message: ""});
    });
});

describe("get recommendations at random", () => {
    it ("should return recommendation with score bigger than 10, when random bigger than 0.7 ", async () => {
        const random = 0.7;
        const position = 0;
        const score = 15;
        const recommendations = createRecommendationFactory.createManyRecommendationData(2);
        recommendations[position].score = score;
        
        jest.spyOn(Math, "random").mockImplementationOnce(() : any => random);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(() : any => recommendations);
        jest.spyOn(Math, "floor").mockImplementationOnce(() : any => position);

        const request = await recommendationService.getRandom();

        expect(Math.random).toBeCalled();
        expect(recommendationRepository.findAll).toBeCalled();
        expect(Math.floor).toBeCalled();
        expect(request).toEqual(recommendations[position]);
    });

    it ("should return recommendation with score less than 10, when random less than 0.7 ", async () => {
        const random = 0.3;
        const position = 1;
        const score = 15;
        const recommendations = createRecommendationFactory.createManyRecommendationData(2);
        recommendations[position].score = score;
        
        jest.spyOn(Math, "random").mockImplementationOnce(() : any => random);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(() : any => recommendations);
        jest.spyOn(Math, "floor").mockImplementationOnce(() : any => position-1);

        const request = await recommendationService.getRandom();

        expect(Math.random).toBeCalled();
        expect(recommendationRepository.findAll).toBeCalled();
        expect(Math.floor).toBeCalled();
        expect(request).not.toEqual(recommendations[position]);
    });

    it ("should return any recommendation, when all recommendations scores is bigger than 10", async () => {
        const random = 1;
        const position = 0;
        const score = 15;
        const recommendations = createRecommendationFactory.createManyRecommendationData(2);
        
        recommendations.forEach(recommendation => recommendation.score=score);
        
        jest.spyOn(Math, "random").mockImplementationOnce(() : any => random);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(() : any => recommendations);
        jest.spyOn(Math, "floor").mockImplementationOnce(() : any => position);

        const request = await recommendationService.getRandom();

        expect(Math.random).toBeCalled();
        expect(recommendationRepository.findAll).toBeCalled();
        expect(Math.floor).toBeCalled();
        expect(request).toEqual(recommendations[position]);
    });

    it ("should return any recommendation, when all recommendations scores is less than 10", async () => {
        const random = 1;
        const position = 0;
        const recommendations = createRecommendationFactory.createManyRecommendationData(2);
        
        jest.spyOn(Math, "random").mockImplementationOnce(() : any => random);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(() : any => recommendations);
        jest.spyOn(Math, "floor").mockImplementationOnce(() : any => position);

        const request = await recommendationService.getRandom();

        expect(Math.random).toBeCalled();
        expect(recommendationRepository.findAll).toBeCalled();
        expect(Math.floor).toBeCalled();
        expect(request).toEqual(recommendations[position]);
    });

    it ("should return erro when don't exist recommendations", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(() : any => []);

        const request = recommendationService.getRandom();

        expect(recommendationRepository.findAll).toBeCalled();
        expect(request).rejects.toEqual({type: "not_found", message: ""});
    });
});

describe("get recommendations at random", () => {
    it ("should return recommendations with bigger score on top", async () => {
        const amount = 10;
        const score = 15;
        const recommendations = createRecommendationFactory.createManyRecommendationData(amount);
        recommendations[0].score = score;
        
        jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce(() : any => recommendations);

        const request = await recommendationService.getTop(amount);

        expect(recommendationRepository.getAmountByScore).toBeCalled();
        expect(request[0]).toEqual(recommendations[0]);
        expect(request).toEqual(recommendations);
    });
});