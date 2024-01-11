import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const timer = { timeout: 120000 };
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), timer.timeout);

  try {
    const request = await fetch(`${process.env.CBAS_URL}`, {
      ...timer,
      body: JSON.stringify(req.body),
      method: req.method,
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    });

    const data = await request.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  } finally {
    clearTimeout(timeout);
  }
}
