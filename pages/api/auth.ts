import { NextApiRequest, NextApiResponse } from 'next'
import { createSession } from '../../lib/session'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end()
  
  const { username, password } = req.body
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = await createSession()
    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=7200`)
    return res.json({ success: true })
  }
  res.status(401).json({ error: 'Invalid credentials' })
}