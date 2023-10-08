import express, {Application, Request, Response, NextFunction} from "express";
import Logger from "./config/logger"
import config from "./config/config";
import helmet from "helmet";

import tokenRouter from "./routes/token";
import authRouter from "./routes/auth";
import memberRouter from "./routes/member";

const app: Application = express()
const port = config.server.port

app.use(helmet())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/tokens", tokenRouter)
app.use("/api/v1/members", memberRouter)

function startApp(){
    app.listen(port)
    Logger.Info(`app is listening on port ${port}`)
}

startApp()