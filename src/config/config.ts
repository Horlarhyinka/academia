import dotenv from "dotenv";
import { hostname } from "os";

dotenv.config()

const MYSQL_HOST_NAME = process.env.MYSQL_HOST_NAME || "localhost"
const MYSQL_USER = process.env.MYSQL_USER || "academia_user"
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "academia"
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "Academia@Edu123!"

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT! || 7000
const SERVER_SECRET = process.env.SERVER_SECRET!

const MAIL_USER = process.env.MAIL_USER 
const MAIL_PASS = process.env.MAIL_PASS
const MAIL_ADDRESS = process.env.MAIL_ADDRESS || "testmailaddress@gmail.com"
const MAIL_HOST = process.env.MAIL_HOST || "smtp.mailtrap.io"

const MYSQL = {
    host: MYSQL_HOST_NAME,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD
}

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    secret: SERVER_SECRET
}

const MAILER = {
    user: MAIL_USER,
    pass: MAIL_PASS,
    address: MAIL_ADDRESS,
    host: MAIL_HOST
}

const services = {
    mailer: MAILER
}

const config = {
    server: SERVER,
    db: MYSQL,
    services
}

export default config;
