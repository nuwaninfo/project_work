import { Request, Response, Router } from "express"
import { Card, ICard } from "../models/Card"
import { validateToken, CustomRequest } from "../middleware/validateToken"

const cardRouter: Router = Router()

// Add a new card
cardRouter.post(
  "/",
  [validateToken],
  async (req: CustomRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Access denied." })
      }

      const cardName: string = req.body.cardName
      const columnId: string | undefined = req.columnId

      const card: ICard = new Card({
        cardName: cardName,
        column: columnId,
      })
      await card.save()

      // Fetch card names and IDs associated with the column Id
      const cards: { _id: string; cardName: string }[] = await Card.find(
        { column: columnId },
        { cardName: 1, _id: 1 }
      )

      res.status(201).json({ message: "card added sucessfully", cards: cards })
    } catch (error: any) {
      console.log(`Error while fecthing cards ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
)

// Get all cards for a particualr column
cardRouter.get(
  "/",
  [validateToken],
  async (req: CustomRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Access denied." })
      }
      console.log(req.columnId)
      const columnId: string = req.columnId!

      // Fetch cards for a particualr column
      const cards: { _id: string; columnName: string }[] = await Card.find(
        { column: columnId },
        { cardName: 1, _id: 1 }
      )

      res.status(200).json({ cards: cards })
    } catch (error: any) {
      console.log(`Error while fecthing cards ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
)
export default cardRouter
