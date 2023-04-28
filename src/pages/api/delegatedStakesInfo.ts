// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import get from "lodash/get";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).send({ message: "Method Not Allowed" });
  }

  try {
    const delegatedStakesInfo = await axios(
      `https://hnt-explorer.herokuapp.com/v1/delegated_stakes/info`
    );

    const { data } = delegatedStakesInfo;
    res.status(200).json(data);
  } catch (error) {
    const { data } = get(error as any, "response", {});
    return res.status(500).json(data);
  }
}
