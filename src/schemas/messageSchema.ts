import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .max(300, { message: "message should not excced 300 characters" })
    .min(10, { message: "message should be least 10 characters" }),
});
