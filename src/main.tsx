// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, useNavigate } from 'react-router-dom'
import { createContext, useState, useContext, ReactNode } from 'react';
import { List, ListItem, ListItemText, Checkbox, TextField, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { createBrowserRouter } from 'react-router-dom';

interface PlanItem {
  id: number;
  text: string;
  predicted: boolean;
}

interface Plan {
  name: string;
  items: PlanItem[];
}

interface PlanContextType {
  plan: Plan;
  setName: (name: string) => void;
  addItem: (text: string) => void;
  togglePredicted: (id: number) => void;
  resetPlan: () => void;
}




const PlanContext = createContext<PlanContextType | undefined>(undefined);

const usePlanContext = (): PlanContextType => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlanContext must be used within a PlanProvider');
  }
  return context;
};

interface PlanProviderProps {
  children: ReactNode;
}

const PlanProvider: React.FC<PlanProviderProps> = ({ children }) => {
  const [plan, setPlan] = useState<Plan>({ name: '', items: [] });

  const setName = (name: string) => {
    setPlan(prevPlan => ({ ...prevPlan, name }));
  };

  const addItem = (text: string) => {
    setPlan(prevPlan => ({
      ...prevPlan,
      items: [...prevPlan.items, { id: Date.now(), text, predicted: false }]
    }));
  };

  const togglePredicted = (id: number) => {
    setPlan(prevPlan => ({
      ...prevPlan,
      items: prevPlan.items.map(item =>
        item.id === id ? { ...item, predicted: !item.predicted } : item
      )
    }));
  };

  const resetPlan = () => {
    setPlan({ name: '', items: [] });
  };

  const contextValue: PlanContextType = {
    plan,
    setName,
    addItem,
    togglePredicted,
    resetPlan
  };

  return (
    <PlanContext.Provider value={contextValue}>
      {children}
    </PlanContext.Provider>
  );
};

const Home: React.FC = () => {
  const { plan } = usePlanContext();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Plan Creator
      </Typography>
      {plan.name ? (
        <Typography variant="body1">
          Your current plan "{plan.name}" has {plan.items.length} items,
          with {plan.items.filter(item => item.predicted).length} predicted to complete.
        </Typography>
      ) : (
        <Typography variant="body1">
          Start creating your plan by clicking on the "Create Plan" button above.
        </Typography>
      )}
    </Box>
  );
}

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <PlanProvider>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Plan Creator
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/create-plan">Create Plan</Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Outlet />
        </Container>
      </PlanProvider>
    </ThemeProvider>
  );
}


const NamePlan: React.FC = () => {
  const { plan, setName } = usePlanContext();
  const navigate = useNavigate();

  const handleNext = () => {
    if (plan.name.trim()) {
      navigate('/create-plan/add-items');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Name Your Plan</Typography>
      <TextField
        fullWidth
        label="Plan Name"
        value={plan.name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      <Button onClick={handleNext} variant="contained" sx={{ mt: 2 }}>
        Next
      </Button>
    </Box>
  );
};

const AddItems: React.FC = () => {
  const { plan, addItem } = usePlanContext();
  const [newItem, setNewItem] = useState('');
  const navigate = useNavigate();

  const handleAddItem = () => {
    if (newItem.trim()) {
      addItem(newItem.trim());
      setNewItem('');
    }
  };

  const handleNext = () => {
    if (plan.items.length > 0) {
      navigate('/create-plan/predict');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Plan: {plan.name}
      </Typography>
      <TextField
        fullWidth
        label="New Item"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        margin="normal"
      />
      <Button onClick={handleAddItem} variant="contained" sx={{ mt: 2, mr: 2 }}>
        Add Item
      </Button>
      <Button onClick={handleNext} variant="contained" sx={{ mt: 2 }}>
        Next
      </Button>
      <List sx={{ mt: 2 }}>
        {plan.items.map((item) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const PredictCompletion: React.FC = () => {
  const { plan, togglePredicted } = usePlanContext();
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/create-plan/summary');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Predict Completion</Typography>
      <List>
        {plan.items.map((item) => (
          <ListItem key={item.id}>
            <Checkbox
              checked={item.predicted}
              onChange={() => togglePredicted(item.id)}
            />
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Button onClick={handleNext} variant="contained" sx={{ mt: 2 }}>
        Next
      </Button>
    </Box>
  );
};

const PlanSummary: React.FC = () => {
  const { plan, resetPlan } = usePlanContext();
  const navigate = useNavigate();

  const handleReset = () => {
    resetPlan();
    navigate('/');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Plan Summary</Typography>
      <Typography gutterBottom>Name: {plan.name}</Typography>
      <Typography gutterBottom>Total Items: {plan.items.length}</Typography>
      <Typography gutterBottom>
        Predicted to complete: {plan.items.filter((item) => item.predicted).length}
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Predicted to Complete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plan.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  {item.text}
                </TableCell>
                <TableCell align="right">
                  {item.predicted ? 'Yes' : 'No'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={handleReset} variant="contained" sx={{ mt: 2 }}>
        Create New Plan
      </Button>
    </Box>
  );
};

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
        path: 'create-plan',
        children: [
          {
            index: true,
            element: <NamePlan />,
          },
          {
            path: 'add-items',
            element: <AddItems />,
          },
          {
            path: 'predict',
            element: <PredictCompletion />,
          },
          {
            path: 'summary',
            element: <PlanSummary />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
