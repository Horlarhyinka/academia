import { user_int, user_type } from "./types/user";
import { Exec } from "../config/mysql";
import bcrypt, { hash } from "bcrypt";
import logger from "../config/logger";
import jwt from "jsonwebtoken";
import config from "../config/config";

type create_res = {insertId: number}

class User implements user_int{
    email: string;
    password: string;
    // encrypt: (plain: string) => Promise<String>;
    // compare: (plain: string, hashed: string) => Promise<boolean>;
    // update: (userId: number, params: { password?: string | undefined; }) => Promise<user_type>;
    // getOne: (userId: number) => Promise<user_type>;
    // delete: (userId: number) => Promise<Boolean>;
    // getAll: () => Promise<user_type[]>;
    

    constructor(email: string, password: string){
        this.email = email;
        this.password = password
    }

    public static encrypt = async(plain: string) => {
        const salt = await bcrypt.genSalt(12)
        const hashed = await bcrypt.hash(plain, salt)
        return hashed;
    }
    public static compare = async(plain: string, hashed: string)=>{
        return bcrypt.compare(plain, hashed)
    }

    public static createJWT = (userId: number)=>{
        const tokenObj = {userId}
        return jwt.sign(tokenObj, config.server.secret, {expiresIn: "2d"})
    }

    public static verifyJWT = (token: string)=>{
        return jwt.verify(token, config.server.secret)
    }

    save = async() => {
        this.password = await User.encrypt(this.password)
        const createRes = (await Exec(`INSERT INTO Users (email, password) VALUES("${this.email}", "${this.password}");`)) as create_res;
        return User.getOne(createRes.insertId)
    }
    public static update = async(userId: number, params: {password?:string})=>{
        const target = await User.getOne(userId)
        if(!Object.keys(params).length)return target;
        params.password && (params.password = await User.encrypt(params.password))
            await Exec(`UPDATE Users SET password = "${params.password}" WHERE userId=${userId}`)
            return User.getOne(userId)
    }
    public static getOne = async(userId: number)=>{
        const target = (await Exec(`SELECT * FROM Users WHERE UserId=${userId};`)) as user_type[]
        return target[0]
    }

    public static delete = async(userId: number) => {
        try {
            await Exec(`DELETE FROM Users WHERE userId=${userId};`)
            return true;
        } catch (error) {
            logger.Error(error as Error)
            return false
        }
    };
    public static getAll =async () => {
        const res = (await Exec(`SELECT * FROM Users;`)) as user_type[]
        return res
    }
}

export default User;