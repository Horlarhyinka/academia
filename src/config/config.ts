import dotenv from "dotenv";
import { hostname } from "os";

dotenv.config()

const MYSQL_HOST_NAME = process.env.MYSQL_HOST_NAME || "localhost"
const MYSQL_USER = process.env.MYSQL_USER || "academia_user"
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "academia"
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "academia@edu123!"

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 7000

const MYSQL = {
    host: MYSQL_HOST_NAME,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD
}

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
}

const config = {
    server: SERVER,
    db: MYSQL
}

export default config;
