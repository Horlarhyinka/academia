import express, {Application, Request, Response, NextFunction} from "express";
import Logger from "./config/logger"
import config from "./config/config";
import helmet from "helmet";

import tokenRouter from "./routes/token"

const app: Application = express()
const port = config.server.port

app.use(helmet())
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use("/token", tokenRouter)

function startApp(){
    app.listen(port)
    Logger.Info(`app is listening on port ${port}`)
}

startApp()