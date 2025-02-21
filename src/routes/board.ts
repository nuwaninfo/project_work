import { Request, Response, Router } from "express"
import { KanbanBoard, IKanbanBoard } from "../models/KanbanBoard"

const boardRouter: Router = Router()

// Save the column count in the Board table
boardRouter.post("/saveColumnCount", async (req: Request, res: Response) => {
  try {
    const userId: string = req.body.userId
    const columnCount: number = req.body.password

    const board: IKanbanBoard = new KanbanBoard({
      columnCount: columnCount,
      user: req.body.userId,
    })
    await board.save()
    console.log("Board saved!")
  } catch (error: any) {
    console.log(`Error while fecthing an user ${error}`)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

export default boardRouter
