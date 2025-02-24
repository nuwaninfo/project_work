import { Request, Response, Router } from "express"
import { KanbanBoard, IKanbanBoard } from "../models/KanbanBoard"
import { validateToken, CustomRequest } from "../middleware/validateToken"

const boardRouter: Router = Router()

// Save the column count in the Board table
boardRouter.post(
  "/saveColumnCount",
  [validateToken],
  async (req: CustomRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Access denied." })
      }

      const columnCount: number = req.body.columnCount

      const board: IKanbanBoard = new KanbanBoard({
        columnCount: columnCount,
        user: req.user?._id,
      })
      await board.save()
      res.status(201).json({ columnCount: columnCount })
    } catch (error: any) {
      console.log(`Error while fecthing an user ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
)

export default boardRouter
