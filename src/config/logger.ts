import chalk from "chalk";

class Logger{
    public Info = (arg:any)=>console.log(chalk.bgRgb(48,48,48)(chalk.white("[info]")) + " : " + chalk.white(arg))
    public Log = (arg:any)=>this.Info(arg)
    public Error  = (arg:any | Error | string)=>console.log(`${chalk.bgRedBright(chalk.white("[ERROR] "))} ${typeof arg === "string"? 
    chalk.bgRed(` ${arg}`): 
    arg instanceof Error?
    chalk.red(arg.message) + chalk.redBright(String(arg)):
    chalk.red(arg)}`)
} 

const logger = new Logger()
Object.freeze(Logger)
export default logger;