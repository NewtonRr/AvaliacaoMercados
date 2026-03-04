import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import type { Request, Response, NextFunction } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'token não informado' })
  }
  const [, token] = authHeader.split(' ')
  const JWT_SECRET = process.env.JWT_SECRET || 'secret'
  try {
    const decoded: any = await promisify(jwt.verify)(token, JWT_SECRET)
    ;(req as any).userId = decoded.id

    return next()
  } catch (error) {
    return res.status(401).json({ error: 'token invalido' })
  }
}