import { PushUpdateDataReturn } from "../../interfaces/IMonitor";
import { NextApiRequest, NextApiResponse } from "next";

const pushUpdateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(`${process.env.PUSH_UPDATE_NODE}`, {
      method: req.method,
      body: JSON.stringify(req.body),
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
      },
    });

    const result: PushUpdateDataReturn = await response.json();

    if (response.status !== 200) {
      return res.status(response.status).json({ message: result.message });
    }

    res.status(response.status).json({
      current: result.current,
    });
  } catch (err: any) {
    res.status(500).json({ error: { message: err.message } });
  }
};

export default pushUpdateHandler;
