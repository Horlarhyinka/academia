import Member from "../models/member";
import catchAsyncErrors from "../util/catchAsync";
import { Request, Response } from "express";
import { validateMember } from "../util/validator";
import { roles } from "../models/types/member";
import { token_type } from "../models/types/token";

interface ExtReq extends Request{
    token: token_type
}

export const createMember = catchAsyncErrors(async(req: ExtReq, res: Response)=>{
    const {firstName, lastName, role} = req.body;
    const {tokenId} = req.token
    const memberObj = {firstName, lastName, role: role || roles.STUDENT}
    const validator = validateMember(memberObj)
    if(validator.error)return res.status(400).json(validator.error.details)
    const newMember = await (new Member(firstName, lastName, tokenId, memberObj.role)).save()
    return res.status(201).json(newMember)
})

export const getMembers = catchAsyncErrors(async(req: ExtReq, res: Response)=>{
    const {tokenId} = req.token;
    const members = await Member.getMembers(tokenId)
    return res.status(200).json(members)
})

export const getMember = catchAsyncErrors(async(req: ExtReq, res: Response)=>{
    const {tokenId} = req.token;
    const {memberId} = req.params
    console.log(memberId, typeof memberId, typeof Number(memberId))
    if(!memberId || isNaN(Number(memberId)))return res.status(400).json({message: "invalid member Id"})
    const member = await Member.getOne(Number(memberId), tokenId)
    if(!member)return res.status(404).json({message: "not found."})
    return res.status(200).json(member)
})

export const updateMember = catchAsyncErrors(async(req: ExtReq, res: Response)=>{
    const {tokenId} = req.token;
    const {memberId} = req.params
    const {firstName, lastName} = req.body;
    const memberObj: {firstName?: string, lastName?: string} = {}
    firstName && (memberObj.firstName = firstName);
    lastName && (memberObj.lastName = lastName)
    if(!memberId || isNaN(Number(memberId)))return res.status(400).json({message: "invalid member Id"})
    const updated = await Member.updateMember(Number(memberId), tokenId, memberObj)
    return res.status(200).json(updated)
})

export const updateMemberRole = catchAsyncErrors(async(req: ExtReq, res: Response)=>{
    const {memberId} = req.params
    const {tokenId} = req.token
    let role = req.body.role
    if(isNaN(Number(memberId)))return res.status(400).json({message: "invalid member id"})
    if(!role)return res.status(400).json({message: "select a new role"})
    role = role.toUpperCase()
    if(!roles[role as keyof typeof roles])return res.status(400).json({message:`invalid role ${role}`})
    const updated = await Member.updateMemberRole(Number(memberId), tokenId, roles[role as keyof typeof roles])
    return res.status(200).json(updated)
})

export const deleteMember = catchAsyncErrors(async(req: ExtReq, res: Response)=>{
    const {memberId} = req.params
    const {tokenId} = req.token
    if(isNaN(Number(memberId)))return res.status(400).json({message: "invalid member id"})
    const delRes = await Member.deleteMember(Number(memberId), tokenId)
    if(!delRes)return res.status(500).json({message: "failed to remove member"})
    return res.status(204).json({message: "memder successfully removed"})
})