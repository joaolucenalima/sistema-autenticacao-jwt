import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import z from 'zod'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default async function users(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const secret = process.env.SECRET

  const { method } = req

  if (method === "GET") {

    const validUserData = z.object({
      token: z.string()
    })

    const { token } = validUserData.parse(req.query)

    if (jwt.verify(token, secret!)) {

      const userInfo = jwt.decode(token) as { userId: string, iat: number, exp: number }

      const user = await prisma.user.findUnique({
        where: {
          id: userInfo!.userId,
        }
      })

      return res.status(200).json({ user })
    }

  } else if (method === "POST") {

    const createUserData = z.object({
      email: z.string().email(),
      name: z.string(),
      password: z.string()
    })

    const { email, name, password } = createUserData.parse(req.body)

    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })

    if (user) {
      return res.send('Email ou Usuário já cadastrado')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    if (!user) {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        }
      })

      const token = jwt.sign({ userId: user.id }, secret!, { expiresIn: '12h' })

      return res.status(200).json({ token, user })
    }
  }

  return res.status(404).json({ message: 'Route not found.' })
}