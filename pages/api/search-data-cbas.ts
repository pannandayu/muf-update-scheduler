import ICBASData from "@/interfaces/cbas/ICBASData";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const request = await fetch(`${process.env.JAVA_CBAS_DATA}`, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" },
    });

    const response: ICBASData = await request.json();

    if (Object.keys(response).length === 0) {
      res.status(400).json({ errorMessage: "No reference found in CBAS DB." });
    } else {
      res.status(200).json({ data: response });
    }
  } catch (err) {
    res.status(500).json({
      errorMessage:
        "Error in Search API Search Data CBAS, please try again later.",
    });
  }
}
