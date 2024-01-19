import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const request = await fetch(`${process.env.JAVA_CBAS_NO_RESPONSE}`);
    const response = await request.json();

    res.status(request.ok && request.status === 200 ? 200 : 400).json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}
