import { Router } from "express"
import userRouter from "./user"
import boardRouter from "./board"
import columnRouter from "./column"

const rootRouter: Router = Router()

rootRouter.use("/user", userRouter)
rootRouter.use("/board", boardRouter)
rootRouter.use("/board", columnRouter)

export default rootRouter
