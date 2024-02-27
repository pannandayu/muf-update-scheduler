import { LoginDataReturn } from "../../types/Login";
import { NextApiRequest, NextApiResponse } from "next";

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(`${process.env.LOGIN_NODE}`, {
      method: req.method,
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" },
    });

    const result: LoginDataReturn = await response.json();

    if (response.status !== 200) {
      return res.status(response.status).json({ message: result.message });
    }

    res.status(response.status).json({
      message: result.message,
      username: result.username,
      role: result.role,
      token: result.token,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default loginHandler;
