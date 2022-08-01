import { prisma } from "../database.js";

async function resetDatabase() {
    return await prisma.recommendation.deleteMany({});
}

const e2eRepository = {
    resetDatabase
};
export default e2eRepository;