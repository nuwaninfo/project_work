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

      res
        .status(201)
        .json({ message: "column added sucessfully", columns: columns })
    } catch (error: any) {
      console.log(`Error while fecthing columns ${error}`)
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
      console.log(`Error while fecthing columns ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
)

// Delete a column
columnRouter.delete(
  "/:id",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Access denied." })
      }

      const deleteColumn = await Column.deleteOne({
        _id: req.params.id,
      })
      const columns: { _id: string; columnName: string }[] = await Column.find(
        { user: req.user?._id },
        { columnName: 1, _id: 1 }
      )

      if (deleteColumn.deletedCount === 1) {
        return res
          .status(200)
          .json({ message: "Column deleted successfully.", columns })
      } else {
        return res
          .status(200)
          .json({ message: "Column not found or already deleted.", columns })
      }
    } catch (error: any) {
      console.error("Error deleting topic:", error)
    }
  }
)

export default columnRouter
