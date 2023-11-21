import { z } from "zod";

const InputDataMongoSchema = z.object({
  application_id: z.string().refine(
    (string) => {
      return string.length === 14;
    },
    {
      message:
        "Application ID must consist of PRECISELY 14 numeric characters.",
    }
  ),
});

export default InputDataMongoSchema;
