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
    const { limit, start, timestamp } = req.query;

    let baseUrl = "https://hnt-explorer.herokuapp.com/v1/delegated_stakes";

    let getParameters = `?"`;

    if (limit) {
      getParameters = `${getParameters}limit=${limit}?`;
    }

    if (start) {
      getParameters = `${getParameters}start=${start}?`;
    }

    if (timestamp) {
      getParameters = `${getParameters}timestamp=${timestamp}?`;
    }

    getParameters = getParameters.slice(0, -1);
    getParameters = `${getParameters}"`;

    if (getParameters !== `""`) {
      baseUrl = `${baseUrl}${getParameters}`;
    }

    console.log("baseUrl", baseUrl);

    const delegatedStakes = await axios(baseUrl);

    const { data } = delegatedStakes;
    res.status(200).json(data);
  } catch (error) {
    console.log("error", error);
    const { data } = get(error as any, "response", {});
    return res.status(500).json(data);
  }
}
