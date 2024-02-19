import * as z from "zod";

export const ThreadValidation = z.object({
  text: z.string().min(3, { message: "Minimum 3 characters" }),
  topics: z.string().array().max(5),
  trainingParts: z.string().array().max(5).min(1),
  anotherTrainingParts: z.string().array().max(5).min(1),
  accountId: z.string().nonempty(),
});

export const CommentValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters" }),
});
