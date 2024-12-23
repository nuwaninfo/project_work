import express, { Express } from "express"
import path from "path"
import router from "./src/routes/index"
import dotenv from "dotenv"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 3001

app.use(express.json())

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

app.use("/", router)

app.use(express.static(path.join(__dirname, "../public")))
