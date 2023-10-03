import express, {Application, Request, Response, NextFunction} from "express";
import Logger from "./config/logger"
import config from "./config/config";

const app: Application = express()
const port = config.server.port


function startApp(){
    app.listen(port)
    Logger.Info(`app is listening on port ${port}`)
}

startApp()