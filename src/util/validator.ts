import Joi from "joi";
import { email_regex } from "./regex";

export const validateUserInfo = (obj:{email: string, password: string}) =>Joi.object({
    email: Joi.string().min(6).regex(email_regex).required(),
    password: Joi.string().min(6).required()
}).validate(obj)