import {Request, Response, NextFunction} from "express";
import { Exec } from "../config/mysql";
import { user_type } from "../models/types/user";
import { token_type } from "../models/types/token";

interface ExtReq extends Request{
    token: token_type
}

export default async(req: Request, res: Response, next: NextFunction)=>{
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader?.split(" ")[1]
    if(!tokenHeader || !tokenHeader?.toLowerCase().startsWith("bearer") || !token)return res.status(401).json({message: "unauthenticated", details: "provide a bearer token"})
    const target = ((await Exec(`SELECT * FROM Tokens WHERE uid="${token}"`))as token_type[])[0]
    if(!target)return res.status(401).json({message: "unauthenticated", details: "invalid token"});
    (req as ExtReq)["token"] = target
    next()
}