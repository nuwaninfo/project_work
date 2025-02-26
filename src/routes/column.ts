import { Request, Response, Router } from "express"
import { Column, IColumn } from "../models/Column"
import { validateToken, CustomRequest } from "../middleware/validateToken"

const columnRouter: Router = Router()

// Add a new column
columnRouter.post(
  "/add",
  [validateToken],
  async (req: CustomRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Access denied." })
      }

      const title: string = req.body.columnTitle

      const column: IColumn = new Column({
        title: title,
        user: req.user?._id,
      })
      await column.save()
      res.status(201).json({ columnTitle: title })
    } catch (error: any) {
      console.log(`Error while fecthing an user ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
)

export default columnRouter
