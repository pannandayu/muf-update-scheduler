import { z } from "zod";
const CBASDataSearchSchema = z.object({
  reffnumber: z.string().refine(
    (str) => {
      if (str.includes("I") && str.length === 10) {
        return true;
      }
      return false;
    },
    (str) => ({
      message:
        str === ""
          ? "The input data is empty."
          : `${str} does not have an 'I' or not 10 characters long.`,
    })
  ),
});

export default CBASDataSearchSchema;
