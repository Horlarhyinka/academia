import { token_type } from "../models/types/token";
import { Request, Response, NextFunction } from "express";
import { Exec } from "../config/mysql";
import { user_int, user_type } from "../models/types/user";
import jwt from "jsonwebtoken";
import config from "../config/config";
import logger from "../config/logger";

interface ExtReq extends Request{
    user: user_type
}

export default async(req: Request, res: Response, next: NextFunction)=>{
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader?.split(" ")[1]
    if(!tokenHeader || !tokenHeader?.toLowerCase().startsWith("bearer") || !token)return res.status(401).json({message: "unauthenticated", details: "provide a bearer token"})
    try{
    const decrypt = jwt.verify(token, config.server.secret) as {userId: number}
    const target = ((await Exec(`SELECT * FROM Users WHERE userId=${decrypt.userId}`))as user_type[])[0]
    if(!target)return res.status(401).json({message: "unauthenticated", details: "invalid token"});
    (req as ExtReq)["user"]=target
    next()
    }catch(err){
        logger.Log(err as Error)
        return res.status(401).json({message: "unauthenticated", details: "invalid bearer token"})
    }
}