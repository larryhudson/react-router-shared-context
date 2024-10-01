// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { createContext, useState, useContext, ReactNode } from 'react';
import { List, ListItem, ListItemText, Checkbox, TextField, Button, Box } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { createBrowserRouter } from 'react-router-dom';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
}

const TodoList: React.FC = () => {
  const { todos, addTodo, toggleTodo } = useTodoContext();
  const [newTodo, setNewTodo] = useState<string>('');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        value={newTodo}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <Button sx={{ mt: 2 }} variant="contained" onClick={handleAddTodo}>
        Add Todo
      </Button>
      <List sx={{ mt: 2 }}>
        {todos.map((todo) => (
          <ListItem key={todo.id} disablePadding>
            <Checkbox
              edge="start"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <ListItemText primary={todo.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}



const TodoContext = createContext<TodoContextType | undefined>(undefined);

const useTodoContext = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const contextValue: TodoContextType = {
    todos,
    addTodo,
    toggleTodo
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};

const Home: React.FC = () => {
  const { todos } = useTodoContext();
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Todo App
      </Typography>
      <Typography variant="body1">
        You have completed {completedTodos} out of {todos.length} todos.
      </Typography>
    </Box>
  );
}

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <TodoProvider>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Todo App
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/todos">Todos</Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Outlet />
        </Container>
      </TodoProvider>
    </ThemeProvider>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'todos',
        element: <TodoList />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
