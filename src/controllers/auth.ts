import jwt from "jsonwebtoken";
import catchAsync from "../util/catchAsync";
import { Request, Response } from "express";
import User from "../models/user";
import { validateUserInfo } from "../util/validator";
import { Exec } from "../config/mysql";
import { user_type } from "../models/types/user";
import { randomBytes } from "crypto";
import logger from "../config/logger";
import sendMail from "../services/mailer";

export const register = catchAsync(async(req: Request, res: Response)=>{
    const {email, password} = req.body;
    const validateRes = validateUserInfo({email, password})
    if(validateRes.error)return res.status(400).json({message: validateRes.error.details})
    const exists = ((await Exec(`SELECT * FROM Users WHERE email="${email}";`)) as user_type[])[0]
    if(exists)return res.status(400).json({message: "email is taken."})
    const user = await (new User(email, password)).save()
    return res.status(201).json({user:{...user, password: undefined}, token: User.createJWT(user.userId)})
})

export const login = catchAsync(async(req: Request, res: Response)=>{
    const {email, password} = req.body;
    const validateRes = validateUserInfo({email, password})
    if(validateRes.error)return res.status(400).json({message: validateRes.error.details})
    const target = ((await Exec(`SELECT * FROM Users WHERE email="${email}";`)) as user_type[])[0]
    if(!target)return res.status(404).json({message: "user not found"})
    const comparePass = await User.compare(password, target.password)
    if(!comparePass)return res.status(400).json({message: "incorrect password."})
    return res.status(200).json({user:{...target, password: undefined}, token: User.createJWT(target.userId)})
})

export const forgetPassword = catchAsync(async(req: Request, res: Response)=>{
    const {email} = req.body;
    if(!email) return res.status(400).json({message: "email is required"})
    const target = ((await Exec(`SELECT * FROM Users WHERE email="${email}";`)) as user_type[])[0]
    if(!target)return res.status(404).json({message: "user not found"})
    const token = randomBytes(12).toString("hex")
    const expireTime = Date.now() + 3600000*2
    const url = req.originalUrl + "/" + token
    try{
    await Exec(`INSERT INTO ResetTokens (userId ,token, expireTime) values(${target.userId}, "${token}", ${expireTime});`)
    await sendMail(target.email, "forget-password", {url})
    return res.status(200).json({message: `check ${target.email} inbox to complete password reset.`})
    }catch(err){
        logger.Error(err as Error)
        return res.status(501).json({message: "could not complete password reset."})
    }
})

export const resetPassword = catchAsync(async(req: Request, res: Response)=>{
    const {token} = req.params
    const {password} = req.body;
    if(!password)return res.status(400).json({message: "provide new password"})
    if(!token)return res.status(400).json({message: "password reset token is not provided"})
    const currToken = ((await Exec(`SELECT * FROM ResetTokens WHERE expireTime>=${Date.now()} AND token="${token}";`)) as {userId:number, token: string, expireTime: number}[])[0]
    if(!currToken)return res.status(404).json({message: "invalid/expired token"});
    const currUser = await User.getOne(currToken.userId)
    const updated = await User.update(currUser.userId, {password})
    return res.status(200).json({user:{...updated,password:undefined}, token: User.createJWT(updated.userId)})
})

