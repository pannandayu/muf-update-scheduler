import { UpdateDataRecord } from "@/interfaces/IMonitor";
import { NextApiRequest, NextApiResponse } from "next";

const monitorHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const screening = req.headers.etag!;

  let url =
    screening === "1"
      ? process.env.MONITOR_NODE
      : screening === "2"
      ? process.env.MONITOR_NODE // TODO SC 2 & 3
      : process.env.MONITOR_NODE;

  try {
    const response = await fetch(url!, {
      method: req.method,
      headers: {
        Authorization: req.headers.authorization || "",
      },
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
