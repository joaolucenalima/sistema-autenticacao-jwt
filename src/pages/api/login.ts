import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import z from 'zod'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const secret = process.env.SECRET

  const { method } = req

  if (method === "POST") {
    const validUserData = z.object({
      email: z.string().email(),
      password: z.string()
    })

    const { email, password } = validUserData.parse(req.body)

    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })

    if (!user) {
      return res.status(400).send('Email ou senha incorretos!')
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return res.status(400).send('Email ou senha incorretos!')
    }

    const token = jwt.sign({ userId: user.id }, secret!, { expiresIn: '12h' })

    return res.status(200).json({ token, user })

  } else {
    return res.status(404).send("Route not found")
  }
}