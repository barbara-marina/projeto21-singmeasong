import app from "../../src/app.js";
import supertest from "supertest";
import { prisma } from "../../src/database.js";

export const agent = supertest.agent(app);

async function resetDatabase() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}

const scenarioFactory = {
    resetDatabase
};

export default scenarioFactory;