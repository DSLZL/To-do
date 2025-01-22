import { useState, useEffect } from 'react'
import { 
  Button,
  Input,
  Title1,
  makeStyles,
  tokens,
  Checkbox
} from "@fluentui/react-components"

const useStyles = makeStyles({
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: tokens.spacingVerticalL
  },
  loginForm: {
    display: 'flex',
    gap: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalL
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`
  }
})

export default () => {
  const classes = useStyles()
  const [todos, setTodos] = useState<any[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [login, setLogin] = useState({ username: '', password: '' })

  useEffect(() => { loadTodos() }, [])

  const loadTodos = async () => {
    try {
      const res = await fetch('/api/todos')
      const data = await res.json()
      setTodos(data)
      setIsAdmin(res.status === 200)
    } catch (error) {
      console.error('Failed to load todos:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login)
    })
    res.ok && loadTodos()
  }

  const addTodo = async () => {
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo })
    })
    setNewTodo('')
    loadTodos()
  }

  const deleteTodo = async (id: number) => {
    await fetch(`/api/todos?id=${id}`, { method: 'DELETE' })
    loadTodos()
  }

  return (
    <div className={classes.container}>
      <Title1>Todo List</Title1>
      
      {!isAdmin ? (
        <form className={classes.loginForm} onSubmit={handleLogin}>
          <Input
            placeholder="Username"
            value={login.username}
            onChange={e => setLogin({...login, username: e.target.value})}
          />
          <Input
            type="password"
            placeholder="Password"
            value={login.password}
            onChange={e => setLogin({...login, password: e.target.value})}
          />
          <Button type="submit" appearance="primary">Login</Button>
        </form>
      ) : (
        <>
          <div className={classes.loginForm}>
            <Input
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              placeholder="New todo..."
            />
            <Button appearance="primary" onClick={addTodo}>Add</Button>
          </div>

          <div>
            {todos.map(todo => (
              <div key={todo.id} className={classes.todoItem}>
                <div style={{ flex: 1 }}>{todo.title}</div>
                <Button 
                  appearance="subtle" 
                  onClick={() => deleteTodo(todo.id)}
                >Delete</Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}