import { Request, Response } from "express";
import e2eService from "../services/e2eService.js";

async function resetDatabase(_req: Request, res: Response) {
    console.log("Database is reseted.");
    await e2eService.resetDatabase();
    res.sendStatus(200);
}

const e2eController = {
    resetDatabase
};
export default e2eController;