import { z } from "zod";

const signupValidationSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  signupKey: z.string().min(1),
});

export default signupValidationSchema;
