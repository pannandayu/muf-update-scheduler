import { NextApiRequest, NextApiResponse } from "next";

const signupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(`${process.env.SIGNUP_NODE}`, {
      method: req.method,
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" },
    });

    const result: { message: string } = await response.json();

    return res.status(response.status).json({ message: result.message });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default signupHandler;
