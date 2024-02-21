import * as z from "zod";

export const ThreadValidation = z.object({
  text: z.string().min(3, { message: "Minimum 3 characters" }),
  trainingParts: z.string().array().max(5).min(1),
  gymInfo: z.object({
    name: z.string().max(100).min(3, { message: "Minimum 3 characters" }),
    city: z.string().max(20),
    state: z.string().max(20),
    country: z.string().max(20),
    address: z.string().max(100).optional(),
    zipCode: z.string().max(10).optional(),
  }),
  topics: z.string().array().max(5).optional(),
  anotherTrainingParts: z.string().array().max(5).min(1).optional(),
  goodWithVisiting: z.boolean(),
  // visitingInfo: {
  //   gymName: "",
  //   area: "",
  // },
  visitingInfo: z.array(
    z.object({
        gymName: z.string(),
        area: z.string(),
    })
  ).max(5),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters" }),
});
