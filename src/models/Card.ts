import mongoose, { Document, Schema, Model } from "mongoose"

interface ICard extends Document {
  cardName: string
  column: mongoose.Types.ObjectId
}

const CardSchema: Schema = new Schema<ICard>(
  {
    cardName: { type: String, required: true },
    column: { type: Schema.Types.ObjectId, ref: "Column", required: true },
  },
  {
    timestamps: true,
  }
)

const Card: Model<ICard> = mongoose.model<ICard>("card", CardSchema)

export { Card, ICard }
