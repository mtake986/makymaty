import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  description: { type: String, required: true },
  topics: [
    {
      type: String,
    },
  ],
  trainingParts: [
    {
      type: String,
      required: true,
      enum: [
        "Any",
        "Chest",
        "Back",
        "Shoulder",
        "Biceps",
        "Triceps",
        "Legs",
        "Ham",
        "Glute",
        "Abs",
      ],
    },
  ],
  anotherTrainingParts: [
    {
      type: String,
      required: true,
      enum: [
        "Any",
        "Chest",
        "Back",
        "Shoulder",
        "Biceps",
        "Triceps",
        "Legs",
        "Ham",
        "Glute",
        "Abs",
      ],
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;
