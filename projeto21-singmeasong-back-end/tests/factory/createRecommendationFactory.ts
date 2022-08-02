import { faker } from "@faker-js/faker";
import { Recommendation } from "@prisma/client";
import { prisma } from "../../src/database.js";

export type recommendationData = Omit<Recommendation, "id">;

function createRecommendationData(id: number) : Recommendation {
    return {
        id,
        name: faker.lorem.words(3),
        youtubeLink: "https://www.youtube.com/watch?v=tMgi_Wlzgew",
        score: 0
    } as Recommendation;
}

async function createRecommendation(){
    const recommendation : recommendationData = {
        name: faker.lorem.words(3),
        youtubeLink: "https://www.youtube.com/watch?v=tMgi_Wlzgew",
        score: 0
    };

    return await prisma.recommendation.create({
        data: recommendation
    });
}

function createManyRecommendationData(limit : number ) {
    let recommendations: Recommendation[] = [];

    for (let i = 1; i <= limit; i++) {
        recommendations.push(createRecommendationData(i));
    }

    return recommendations;
}

async function createManyRecommendation(limit : number ) {
    for (let i = 1; i <= limit; i++) {
        const recommendation : recommendationData = {
            name: faker.lorem.words(3),
            youtubeLink: "https://www.youtube.com/watch?v=tMgi_Wlzgew",
            score: parseInt(faker.random.numeric())
        };

        await prisma.recommendation.create({
            data: recommendation
        });
    }
}

const createRecommendationFactory = {
    createRecommendationData,
    createManyRecommendationData,
    createManyRecommendation,
    createRecommendation
};

export default createRecommendationFactory;