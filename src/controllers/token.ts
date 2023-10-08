import { Request, Response } from "express";
import catchAsyncErrors from "../util/catchAsync";
import {Exec } from "../config/mysql";
import {genUid} from "../util/uid";
import logger from "../config/logger";
import { token_type } from "../models/types/token";
import {user_type} from "../models/types/user"

interface ExtReq extends Request{
    user: user_type
}

export const createAccessToken = catchAsyncErrors(async(req: ExtReq, res: Response) =>{
    const uid = genUid()
    const {insertId} = (await Exec(`INSERT INTO Tokens (uid, userId) VALUES('${uid}', ${req.user.userId});`)) as {insertId: number};
    const Token = (await Exec(`SELECT * FROM Tokens WHERE tokenId=${insertId}`) as token_type[])[0]
    console.log({Token})
    if(!Token)return res.status(501).json({message: "failed to create Token"})
    return res.status(201).json(Token)
})

export const getTokens = catchAsyncErrors(async(req: ExtReq, res: Response)=>{
    const Tokens = await Exec(`SELECT * FROM Tokens WHERE userId=${req.user.userId};`)
    return res.status(200).json(Tokens)
})

export const getToken = catchAsyncErrors(async(req: ExtReq, res: Response)=>{
    const tokenId = req.params.tokenId
    try {
        const Token = ((await Exec(`SELECT * FROM Tokens WHERE tokenId='${tokenId}' AND userId=${req.user.userId};`)) as token_type[])[0]
        if(!Token)return res.status(404).json({message: "token not found"})
        return res.status(200).json(Token)
    } catch (error) {
        logger.Log(error)
        return res.status(400).json({message: "failed", details: (error as Error)?.message})
    }
})

export const deleteToken = catchAsyncErrors(async(req: ExtReq, res: Response)=>{
    const uid = req.params.uid || req.body.uid || req.query.uid
    try{
        await Exec(`DELETE FROM Tokens WHERE uid="${uid}" AND userId=${req.user.userId};`)
        return res.status(204).json({message: "deleted"})
    }catch(err){
        logger.Log(err)
        return res.status(400).json({message: "failed", details: (err as Error)?.message})
    }
})


