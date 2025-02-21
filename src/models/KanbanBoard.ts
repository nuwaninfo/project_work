import mongoose, { Document, Schema, Model } from "mongoose"

interface IKanbanBoard extends Document {
  columnCount: number
  user: mongoose.Types.ObjectId
}

const KanbanBoardSchema: Schema = new Schema<IKanbanBoard>(
  {
    columnCount: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
)

const KanbanBoard: Model<IKanbanBoard> = mongoose.model<IKanbanBoard>(
  "KanbanBoard",
  KanbanBoardSchema
)

export { KanbanBoard, IKanbanBoard }
