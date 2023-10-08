export type member_type={
    memberId: number
    firstName: string
    lastName: string
    academyId: number
    role: roles
}

export enum roles {TEACHER="TEACHER", STUDENT = "STUDENT"}

export interface member_int{
    save: ()=>Promise<member_type>
    firstName: string
    lastName: string
    academyId: number
    role: roles
}