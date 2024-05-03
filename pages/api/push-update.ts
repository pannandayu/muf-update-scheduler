import { NextApiRequest, NextApiResponse } from "next";

const pushUpdateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { updateKey, screening, token } = req.body;

    let pushUpdateApi;

    if (screening === 1) {
      pushUpdateApi = process.env.PUSH_UPDATE_NODE_SC1;
    } else if (screening === 2) {
      pushUpdateApi = process.env.PUSH_UPDATE_NODE_SC2;
    } else {
      pushUpdateApi = process.env.PUSH_UPDATE_NODE_SC3;
    }

    if (!pushUpdateApi) {
      return res.status(500).json({ message: "Push update API is empty" });
    }

    const response = await fetch(pushUpdateApi, {
      method: req.method,
      body: JSON.stringify({ updateKey, token }),
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
      },
    });

    const result = await response.json();

    return res.status(response.status).json({ message: result.message });
  } catch (err: any) {
    res.status(500).json({ error: { message: err.message } });
  }
};

export default pushUpdateHandler;
