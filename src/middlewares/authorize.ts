import {Request, Response, NextFunction} from "express";
import { Exec } from "../config/mysql";


export default async(req: Request, res: Response, next: NextFunction)=>{
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader?.split(" ")[1]
    if(!tokenHeader || !tokenHeader?.toLowerCase().startsWith("bearer") || !token)return res.status(401).json({message: "unauthenticated", details: "provide a bearer token"})
    const target = Exec(`SELECT * FROM Tokens WHERE uid=${token}`)
    if(!target)return res.status(401).json({message: "unauthenticated", details: "invalid token"})
}