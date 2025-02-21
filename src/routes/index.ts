import { Router } from "express"
import userRouter from "./user"
import boardRouter from "./board"

const rootRouter: Router = Router()

rootRouter.use("/user", userRouter)
rootRouter.use("/board", boardRouter)

export default rootRouter
