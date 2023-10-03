import config from "./config";
import mysql from "mysql";
import logger from "./logger";

const params = {...config.db}

export const connectDB = ():Promise<mysql.Connection> =>new Promise((resolve, reject)=>{
    const connection = mysql.createConnection(params)
    connection.connect(err=>{
        if(err){
            reject(err)
            return
        }
        resolve(connection)
    })
})

export const Query = (connection: mysql.Connection, query: string) =>new Promise((resolve, reject)=>{
    connection.query(query, (err, res)=>{
        if(err){
            reject(err)
            return
        }
        resolve(res)
    })
})

export const Exec = (query: string) =>new Promise((resolve, reject)=>{
    connectDB().then(connection=>{
        Query(connection, query)
        .then(res=>{
            connection.destroy()
            return res
        })
        .catch(err=>{
            logger.Error(err)
            connection.destroy()
        })
    })
}) 