import {Exec} from "../../config/mysql";

export interface user_int{
    save: (param:{email: string, password: string})=>Promise<user_type>,
    // update: (userId: number, params: {password?: string})=>Promise<user_type>,
    // delete: (userId: number)=>Promise<Boolean>
    // getAll: ()=>Promise<user_type[]>
    // encrypt: (plain: string)=>Promise<String>
    // compare: (plain: string, hashed: string)=>Promise<boolean>
    // getOne: (userId: number)=>Promise<user_type>
    email: string
    password: string
}

export type user_type = {
    email: string
    password: string
    userId: number
}