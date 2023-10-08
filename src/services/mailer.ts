import nodemailer from "nodemailer";
import config from "../config/config";
import ejs from "ejs";
import path from "path"

const transport = nodemailer.createTransport({
    auth:{
        user: config.services.mailer.user,
        pass: config.services.mailer.pass
    },
    host: config.services.mailer.host,
    port: 25,
    service: config.services.mailer.service
})

const sendMail = async(target: string, filename: string, data: any)=>{
    const filePath = path.resolve(__dirname, "../views/"+filename+".ejs")
    const mailbody = (await ejs.renderFile(filePath, data)) as string
    return transport.sendMail({
        from: config.services.mailer.address,
        to: target,
        html: mailbody
    })
}

export default sendMail;