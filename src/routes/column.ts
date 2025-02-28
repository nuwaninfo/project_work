import { Request, Response, Router } from "express"
import { Column, IColumn } from "../models/Column"
import { validateToken, CustomRequest } from "../middleware/validateToken"

const columnRouter: Router = Router()

// Add a new column
columnRouter.post(
  "/",
  [validateToken],
  async (req: CustomRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Access denied." })
      }

      const columnName: string = req.body.columnName

      const column: IColumn = new Column({
        columnName: columnName,
        user: req.user?._id,
      })
      await column.save()

      // Fetch column names and IDs associated with the logged-in user
      const columns: { _id: string; columnName: string }[] = await Column.find(
        { user: req.user?._id },
        { columnName: 1, _id: 1 }
      )

      res.status(201).json({ columns: columns })
    } catch (error: any) {
      console.log(`Error while fecthing an user ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
)

// Get all columns
columnRouter.get(
  "/",
  [validateToken],
  async (req: CustomRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Access denied." })
      }

      // Fetch column names and IDs associated with the logged-in user
      const columns: { _id: string; columnName: string }[] = await Column.find(
        { user: req.user?._id },
        { columnName: 1, _id: 1 }
      )

      res.status(201).json({ columns: columns })
    } catch (error: any) {
      console.log(`Error while fecthing an user ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
)

export default columnRouter
