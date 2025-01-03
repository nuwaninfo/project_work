import mongoose, { Document, Schema, Model } from "mongoose"

interface IKanbanBoard extends Document {
  user: mongoose.Types.ObjectId
}

const KanbanBoardSchema: Schema = new Schema<IKanbanBoard>(
  {
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
