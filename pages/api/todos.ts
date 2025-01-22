import { NextApiRequest, NextApiResponse } from 'next'
import { verifySession } from '../../lib/session'

let todos = [
  { id: 1, title: 'Public Sample', isPublic: true },
  { id: 2, title: 'Admin Only', isPublic: false }
]

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const isAdmin = await verifySession(req.cookies.token || '')
  
  if (req.method === 'GET') {
    return res.json(isAdmin ? todos : todos.filter(t => t.isPublic))
  }

  if (!isAdmin) return res.status(401).json({ error: 'Unauthorized' })

  switch (req.method) {
    case 'POST':
      const newTodo = {
        id: Date.now(),
        title: req.body.title,
        isPublic: req.body.isPublic || false
      }
      todos.push(newTodo)
      return res.json(newTodo)
      
    case 'PUT':
      todos = todos.map(t => 
        t.id === req.body.id ? { ...t, ...req.body } : t
      )
      return res.json(todos)
      
    case 'DELETE':
      todos = todos.filter(t => t.id !== Number(req.query.id))
      return res.status(204).end()
  }
}