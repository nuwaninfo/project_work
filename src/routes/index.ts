import { Router } from "express"
import userRouter from "./user"
import boardRouter from "./board"
import columnRouter from "./column"
import cardRouter from "./card"

const rootRouter: Router = Router()

rootRouter.use("/user", userRouter)
rootRouter.use("/board", boardRouter)
rootRouter.use("/column", columnRouter)
rootRouter.use("/card", cardRouter)

export default rootRouter
