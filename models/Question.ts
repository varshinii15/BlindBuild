import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  category: "math" | "dfs" | "bfs";
  
  sampleRequest: object;
  output: any;
  constraints: string;
}

const QuestionSchema: Schema = new Schema<IQuestion>({
  category: { type: String, enum: ["math", "dfs", "bfs"], required: true },
  sampleRequest: { type: Object, required: true },
  output: { type: Schema.Types.Mixed, required: true },
  constraints: { type: String, required: true }
});

export default mongoose.model<IQuestion>("Question", QuestionSchema);