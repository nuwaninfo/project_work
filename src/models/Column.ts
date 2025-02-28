import mongoose, { Document, Schema, Model } from "mongoose"

interface IColumn extends Document {
  columnName: string
  user: mongoose.Types.ObjectId
}

const ColumnSchema: Schema = new Schema<IColumn>(
  {
    columnName: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
)

const Column: Model<IColumn> = mongoose.model<IColumn>("column", ColumnSchema)

export { Column, IColumn }
