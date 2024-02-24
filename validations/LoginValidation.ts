import { z } from "zod";

const loginValidationSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export default loginValidationSchema;
