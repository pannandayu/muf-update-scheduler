import { UpdateDataCurrent } from "@/interfaces/IMonitor";
import { NextApiRequest, NextApiResponse } from "next";

interface ExpectedResult {
  message?: string;
  data?: UpdateDataCurrent | undefined;
}

const getBatchDataHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const response = await fetch(`${process.env.GET_BATCH_DATA_NODE}`, {
      method: req.method,
      body: JSON.stringify(req.body),
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        Authorization: req.headers.authorization || "",
      },
    });

    const result: ExpectedResult = await response.json();

    if (response.status !== 200) {
      return res.status(response.status).json({
        message: !result.data ? "Data in log file not found" : result.message,
      });
    }

    res.status(response.status).json({
      data: result.data,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default getBatchDataHandler;
