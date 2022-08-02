import { faker } from "@faker-js/faker";
import { Recommendation } from "@prisma/client";

export type recommendationData = Omit<Recommendation, "id" | "score">;

function createRecommendationData(id: number) : Recommendation {
    return {
        id,
        name: `Halloween Special ${faker.lorem.words(1)}`,
        youtubeLink: "https://www.youtube.com/watch?v=tMgi_Wlzgew",
        score: 0
    } as Recommendation;
}

function createManyRecommendationData(limit : number ) {
    let recommendations: Recommendation[] = [];

    for (let i = 1; i <= limit; i++) {
        recommendations.push(createRecommendationData(i));
    }

    return recommendations;
}

const createRecommendationFactory = {
    createRecommendationData,
    createManyRecommendationData
};

export default createRecommendationFactory;