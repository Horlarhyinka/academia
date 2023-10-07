import jwt from "jsonwebtoken";
import catchAsync from "../util/catchAsync";
import { Request, Response } from "express";
import User from "../models/user";
import { validateUserInfo } from "../util/validator";
import { Exec } from "../config/mysql";
import { user_type } from "../models/types/user";

export const register = catchAsync(async(req: Request, res: Response)=>{
    const {email, password} = req.body;
    const validateRes = validateUserInfo({email, password})
    if(validateRes.error)return res.status(400).json({message: validateRes.error.details})
    const exists = ((await Exec(`SELECT * FROM Users WHERE email="${email}";`)) as user_type[])[0]
    if(exists)return res.status(400).json({message: "email is taken."})
    const user = await (new User(email, password)).save()
    return res.status(201).json({...user, password: undefined})
})

export const login = catchAsync(async(req: Request, res: Response)=>{
    const {email, password} = req.body;
    const validateRes = validateUserInfo({email, password})
    if(validateRes.error)return res.status(400).json({message: validateRes.error.details})
    const target = ((await Exec(`SELECT * FROM Users WHERE email="${email}";`)) as user_type[])[0]
    if(!target)return res.status(404).json({message: "user not found"})
    const comparePass = await User.compare(password, target.password)
    if(!comparePass)return res.status(400).json({message: "incorrect password."})
    return res.status(200).json({...target, password: undefined})
})

export const forgetPassword = catchAsync((req: Request, res: Response)=>{
    
})

export const resetPassword = catchAsync((req: Request, res: Response)=>{
    
})