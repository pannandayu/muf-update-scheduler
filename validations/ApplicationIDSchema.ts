import { z } from "zod";

const ApplicationIDSchema = z.object({
  application_id: z.string().refine(
    (string) => string.length === 14,
    (string) => ({
      message: `${string} IS NOT 14 numeric characters long.`,
    })
  ),
});

export default ApplicationIDSchema;
