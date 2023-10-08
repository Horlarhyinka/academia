import {member_int, member_type, roles} from "./types/member";
import { Exec } from "../config/mysql";
import { user_type } from "./types/user";
import logger from "../config/logger";

class Member implements member_int{
    firstName: string;
    lastName: string;
    role = roles.STUDENT
    academyId: number;
    
    constructor(firstName: string, lastName: string, academyId: number, role?: roles){
        this.firstName = firstName
        this.lastName = lastName
        this.academyId = academyId
        if(role && roles[(role.toUpperCase()) as keyof typeof roles]){
            this.role = roles[role.toUpperCase() as keyof typeof roles]
        }
    }
    save = async() =>{
        const insertRes = (await Exec(`INSERT INTO Members (firstName, lastName, academyId, role) VALUES("${this.firstName}", "${this.lastName}", "${this.academyId}", "${this.role}");`)) as {insertId: number};
        return Member.getOne(insertRes.insertId, this.academyId)
    }

    public static getOne = async(memberId: number, academyId: number) =>{
        const res = ((await Exec(`SELECT * FROM Members WHERE memberId=${memberId} AND academyId=${academyId};`))as member_type[])[0]
        return res;
    }

    public static getMembers =async (academyId: number) => {
        const users = (await Exec(`SELECT * FROM Members WHERE academyId=${academyId};`)) as member_int[]
        return users
    }

    public static deleteMember =async (memberId: number, academyId: number) => {
        try{
            await Exec(`DELETE FROM Members WHERE memberId=${memberId} AND academyId=${academyId};`)
            return true;
        }catch(err){
            logger.Error(err as Error)
            return false;
        }
    }

    public static updateMember = async(memberId: number, academyId: number, params: {firstName?: string, lastName?: string})=>{
            const target = await Member.getOne(memberId, academyId)
            const keys = Object.keys(params)
            if(!keys.length)return target;
            let querystr = "UPDATE Members SET"
            for(let key of keys){
                if(key !== keys[0]){
                    querystr += ","
                }
                querystr += ` ${key}="${params[key as keyof typeof params]}"`
            }
            querystr += " WHERE memberId=" + memberId + ";"
            await Exec(querystr)
            return Member.getOne(memberId, academyId)
    }

    public static updateMemberRole = async(memberId: number, academyId: number, role: roles) =>{
            await Exec(`UPDATE Members set role="${role}" WHERE memberId=${memberId};`)
            return Member.getOne(memberId, academyId)
    }
}

export default Member;