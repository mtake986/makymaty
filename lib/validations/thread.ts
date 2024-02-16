import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(3, {message: "Minimum 3 characters"}),
  tags: z.string().array().max(5),
  accountId: z.string().nonempty()
});


export const CommentValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters" }),
});
