import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database.js";
import { Recommendation } from "@prisma/client";

export type recommendationData = Omit<Recommendation, "id" | "score">;

function createRecommendationData() {
    return {
        name: `Halloween Special ${faker.lorem.words(1)}`,
        youtubeLink: "https://www.youtube.com/watch?v=tMgi_Wlzgew"
    }
}
async function createRecommendationAndReturnData() {
    const recommendation: recommendationData = createRecommendationData();

    return await prisma.recommendation.create({
        data: recommendation
    });
}

async function createManyRecommendation(limit : number ) {
    for (let i = 0; i < limit; i++) {
        createRecommendationAndReturnData();
    }
    
    return await prisma.recommendation.findMany({
        skip: 0,
        take: limit
    });
}

const createRecommendationFactory = {
    createRecommendationData,
    createRecommendationAndReturnData, 
    createManyRecommendation
};

export default createRecommendationFactory;