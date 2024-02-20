import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  text: { type: String, required: true },
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
        "chest",
        "back",
        "shoulder",
        "biceps",
        "triceps",
        "legs",
        "ham",
        "glute",
        "abs",
      ],
    },
  ],
  gymInfo: {
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String },
    zipCode: { type: String },
  },
  anotherTrainingParts: [
    {
      type: String,
      enum: [
        "chest",
        "back",
        "shoulder",
        "biceps",
        "triceps",
        "legs",
        "ham",
        "glute",
        "abs",
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
