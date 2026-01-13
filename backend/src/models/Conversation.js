import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const ConversationSchema = new mongoose.Schema({
  sessionId: String,
  messages: [MessageSchema],
  context: Object
});

export default mongoose.model("Conversation", ConversationSchema);
