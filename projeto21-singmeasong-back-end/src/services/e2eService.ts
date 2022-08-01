import e2eRepository from "../repositories/e2eRepository.js";

async function resetDatabase() {
    await e2eRepository.resetDatabase();
}

const e2eService = {
    resetDatabase
};
export default e2eService;