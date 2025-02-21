import express, { Express } from "express"
import path from "path"
import rootRouter from "./src/routes"
import dotenv from "dotenv"
import mongoose, { Connection } from "mongoose"
import cors, { CorsOptions } from "cors"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 3001

const mongoDB: string = "mongodb://127.0.0.1:27017/project_work"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error"))

const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

app.use("/api/v1/", rootRouter)

app.use(express.static(path.join(__dirname, "../public")))
