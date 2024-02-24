import { NextApiRequest, NextApiResponse } from "next";

const monitorHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(`${process.env.MONITOR_NODE}`, {
      method: req.method,
      headers: { Authorization: req.headers.authorization || "" },
    });

    if (response.status === 500) {
      throw new Error("Error when accessing monitoring dashboard");
    }

    const result = await response.json();

    res.status(response.status).json({ message: result.message });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default monitorHandler;
