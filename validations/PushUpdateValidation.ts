import { z } from "zod";

const pushUpdateValidationSchema = z.object({
  updateKey: z.string().min(1),
  screening: z.number(),
});

export default pushUpdateValidationSchema;
