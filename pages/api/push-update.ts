import { PushUpdateDataReturn } from "./../../types/Monitor";
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
      return res.status(response.status).json({
        error: {
          message: result.error?.message || "Error while pushing update",
        },
      });
    }

    res.status(response.status).json({
      current: {
        data: {
          message: result.current.data.message,
          currentData: result.current.data.currentData,
          dateTime: result.current.data.dateTime,
          size: result.current.data.size,
        },
      },
      record: {
        data: result.record.data,
        size: result.record.size,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: { message: err.message } });
  }
};

export default pushUpdateHandler;
