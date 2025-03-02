import { Router } from "express"
import userRouter from "./user"
import boardRouter from "./board"
import columnRouter from "./column"
import cardRouter from "./card"
import { CustomRequest } from "../middleware/validateToken"

const rootRouter: Router = Router()

rootRouter.use("/user", userRouter)
rootRouter.use("/board", boardRouter)
rootRouter.use("/column", columnRouter)
// Pass columnId to cardRouter
rootRouter.use(
  "/column/:columnId/card",
  (req: CustomRequest, res, next) => {
    req.columnId = req.params.columnId // Pass columnId to the cardRouter
    next()
  },
  cardRouter
)

export default rootRouter
