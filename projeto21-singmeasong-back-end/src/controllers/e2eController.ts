import e2eService from "../services/e2eService";

async function resetDatabase() {
    console.log("Database is reseted.");
    await e2eService.resetDatabase();
}

const e2eController = {
    resetDatabase
};
export default e2eController;