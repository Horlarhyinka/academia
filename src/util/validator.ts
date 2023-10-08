import Joi from "joi";
import { email_regex, name_regex } from "./regex";
import { roles } from "../models/types/member";

export const validateUserInfo = (obj:{email: string, password: string}) =>Joi.object({
    email: Joi.string().min(6).regex(email_regex).required(),
    password: Joi.string().min(6).required()
}).validate(obj)

export const validateMember = (obj:{firstName: string, lastName: string, role?: roles})=>Joi.object({
    firstName: Joi.string().min(3).regex(name_regex).required(),
    lastName: Joi.string().min(3).regex(name_regex).required(),
    role: Joi.string().default(roles.STUDENT),
}).validate(obj)

