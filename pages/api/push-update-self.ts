import { NextApiRequest, NextApiResponse } from "next";

const pushUpdateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { updateKey, screening } = req.body;

    let pushUpdateApi;

    if (screening === 1) {
      pushUpdateApi = process.env.PUSH_UPDATE_NODE_SC1_SELF;
    } else if (screening === 2) {
      pushUpdateApi = process.env.PUSH_UPDATE_NODE_SC2_SELF;
    } else {
      pushUpdateApi = process.env.PUSH_UPDATE_NODE_SC3_SELF;
    }

    if (!pushUpdateApi) {
      return res.status(500).json({ message: "Push update API is empty" });
    }

    const response = await fetch(pushUpdateApi, {
      method: req.method,
      body: JSON.stringify({ updateKey }),
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        Authorization: req.headers["authorization"] || "",
      },
    });

    let result;
    if (!response.ok) {
      if (screening === 1) {
        result = await response.json();
      } else {
        const errorText = await response.text();
        result = { error: { message: errorText, status: response.status } };
      }
    } else {
      result = await response.json();
    }

    return res.status(response.status).json({ response: result });
  } catch (err: any) {
    res.status(500).json({ error: { message: err.message } });
  }
};

export default pushUpdateHandler;
