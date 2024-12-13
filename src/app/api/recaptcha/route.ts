import axios from "axios";
import type { NextApiHandler } from "next";
import { z } from "zod";
import { env } from "@/server/env";

export async function verifyCaptcha(token: string) {
  const res = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: env.GOOGLE_RECAPTCHA_SITE_KEY,
        response: token,
      },
    }
  );
  if (res.status === 200) return true;
  return false;
}

const handler: NextApiHandler = async (req, res) => {
  try {
    const body = z
      .object({
        name: z.string().nonempty(),
        email: z.string().nonempty(),
        message: z.string().nonempty(),
        token: z.string().nonempty(),
      })
      .parse(req.body);

    const check = await verifyCaptcha(body.token);
    if (!check) res.status(401).send(undefined);

    return res.status(200).send(undefined);
  } catch (error) {
    console.error("Error during form submission:", error);
    return res.status(500).send(undefined);
  }
};

export default handler;
