import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const request = await fetch(`${process.env.CBAS_URL}`, {
      body: JSON.stringify(req.body),
      method: req.method,
      headers: { "Content-Type": "application/json" },
    });

    const data = await request.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
}
