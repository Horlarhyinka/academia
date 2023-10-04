import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export default (fn: Function) =>async(req: Request, res: Response, next: NextFunction) =>{
    try {
        return fn(req, res,next)
    } catch (error) {
        logger.Error(error)
        return res.status(501).json({message: "Internal Server", details: (error as Error).message})
    }
}