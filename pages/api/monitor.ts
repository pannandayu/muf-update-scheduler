import { UpdateDataRecord } from "@/interfaces/IMonitor";
import { NextApiRequest, NextApiResponse } from "next";

const monitorHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(`${process.env.MONITOR_NODE}`, {
      method: req.method,
      headers: { Authorization: req.headers.authorization || "" },
    });

    const result: UpdateDataRecord = await response.json();

    if (response.status !== 200) {
      res.status(response.status).json({ message: result.message });
    }

    res.status(response.status).json({
      record: result.record,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default monitorHandler;
