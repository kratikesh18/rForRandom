import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "username must have 2 characters ")
  .max(15, "should not exceed 15 characters ")
  .regex(/^[a-zA-Z0-9_]+$/, "username cannnot contain special characters");

export const signupSchema = z.object({
  username: userNameValidation,
  email: z.string().email({message:"invalid email recived"}),
  password:z.string().min(6,{message:"Password must be 6 characters "})
});
