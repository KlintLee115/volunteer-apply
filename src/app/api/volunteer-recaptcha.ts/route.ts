import type { NextApiHandler } from 'next'
import { z } from 'zod'
import { verifyCaptcha } from '../recaptcha/route'

const handler: NextApiHandler = async (req, res) => {
  try {
    const body = z
      .object({
        name: z.string().nonempty(),
        email: z.string().nonempty(),
        message: z.string().nonempty(),
        roles: z.string().nonempty(),
        resume: z.string().nonempty(),
        token: z.string().nonempty(),
      })
      .parse(req.body)

    const check = await verifyCaptcha(body.token)
    if (!check) res.status(401).send(undefined)


    return res.status(200).send(undefined)
  } catch (error) {
    return res.status(500).send(undefined)
  }
}

export default handler