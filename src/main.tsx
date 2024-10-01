// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, useNavigate, useLocation, Navigate } from 'react-router-dom'
// Import necessary hooks and types for React Context
import { createContext, useState, useContext, ReactNode } from 'react';
import { List, ListItem, ListItemText, Checkbox, TextField, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stepper, Step, StepLabel } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { createBrowserRouter } from 'react-router-dom';

const steps = [
  { title: 'Name Plan', url: 'name-plan' },
  { title: 'Add Items', url: 'add-items' },
  { title: 'Predict Completion', url: 'predict' },
  { title: 'Summary', url: 'summary' },
];

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




// Create a context with a default value of undefined
const PlanContext = createContext<PlanContextType | undefined>(undefined);

// Custom hook to use the PlanContext
const usePlanContext = (): PlanContextType => {
  const context = useContext(PlanContext);
  if (!context) {
    // Ensure the hook is used within a PlanProvider
    throw new Error('usePlanContext must be used within a PlanProvider');
  }
  return context;
};

interface PlanProviderProps {
  children: ReactNode;
}

// PlanProvider component to wrap the app and provide the context
const PlanProvider: React.FC<PlanProviderProps> = ({ children }) => {
  // State to hold the plan data
  const [plan, setPlan] = useState<Plan>({ name: '', items: [] });

  // Functions to update the plan state
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

  // Create an object with the context value
  const contextValue: PlanContextType = {
    plan,
    setName,
    addItem,
    togglePredicted,
    resetPlan
  };

  // Provide the context value to all child components
  return (
    <PlanContext.Provider value={contextValue}>
      {children}
    </PlanContext.Provider>
  );
};

// Home component using the PlanContext
const Home: React.FC = () => {
  // Access the plan data from the context
  const { plan } = usePlanContext();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Plan Creator
      </Typography>
      <Typography variant="body1" paragraph>
        This app demonstrates the use of React Context for state management and React Router for navigation.
      </Typography>
      <Typography variant="body1" paragraph>
        Create a new plan by clicking the "Create Plan" button in the navigation bar. You'll go through a 4-step process:
      </Typography>
      <ol>
        <li>Name your plan</li>
        <li>Add items to your plan</li>
        <li>Predict which items you'll complete</li>
        <li>Review a summary of your plan</li>
      </ol>
      {plan.name ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Your current plan "{plan.name}" has {plan.items.length} items,
          with {plan.items.filter(item => item.predicted).length} predicted to complete.
        </Typography>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          You haven't created a plan yet. Start by clicking the "Create Plan" button above.
        </Typography>
      )}
    </Box>
  );
}

const theme = createTheme();

// Main App component
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* Wrap the entire app with PlanProvider to make context available */}
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


// NamePlan component for the first step of plan creation
const NamePlan: React.FC = () => {
  // Access plan data and setName function from context
  const { plan, setName } = usePlanContext();
  const navigate = useNavigate();

  const handleNext = () => {
    if (plan.name.trim()) {
      navigate('/create-plan/add-items');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Step 1: Name Your Plan</Typography>
      <Typography variant="body1" paragraph>
        Give your plan a meaningful name. This name will be used throughout the process.
      </Typography>
      <TextField
        fullWidth
        label="Plan Name"
        value={plan.name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      <Button onClick={handleNext} variant="contained" sx={{ mt: 2 }} disabled={!plan.name.trim()}>
        Next
      </Button>
    </Box>
  );
};

// AddItems component for adding items to the plan
const AddItems: React.FC = () => {
  // Access plan data and addItem function from context
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
        Step 2: Add Items to "{plan.name}"
      </Typography>
      <Typography variant="body1" paragraph>
        Add items to your plan. You can add as many items as you need.
      </Typography>
      <TextField
        fullWidth
        label="New Item"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        margin="normal"
      />
      <Button onClick={handleAddItem} variant="contained" sx={{ mt: 2, mr: 2 }} disabled={!newItem.trim()}>
        Add Item
      </Button>
      <Button onClick={handleNext} variant="contained" sx={{ mt: 2 }} disabled={plan.items.length === 0}>
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

// PredictCompletion component for predicting item completion
const PredictCompletion: React.FC = () => {
  // Access plan data and togglePredicted function from context
  const { plan, togglePredicted } = usePlanContext();
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/create-plan/summary');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Step 3: Predict Completion</Typography>
      <Typography variant="body1" paragraph>
        Check the items you predict you'll complete. This helps in prioritizing your tasks.
      </Typography>
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

// PlanSummary component to display the final plan
const PlanSummary: React.FC = () => {
  // Access plan data and resetPlan function from context
  const { plan, resetPlan } = usePlanContext();
  const navigate = useNavigate();

  const handleReset = () => {
    resetPlan();
    navigate('/');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Step 4: Plan Summary</Typography>
      <Typography variant="body1" paragraph>
        Here's a summary of your plan. You can create a new plan or return to the home page.
      </Typography>
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

const PlanCreationStepper: React.FC = () => {
  const location = useLocation();
  const currentStep = steps.findIndex((step) => 
    location.pathname.includes(step.url)
  );

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper activeStep={currentStep}>
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          return (
            <Step key={step.title} {...stepProps}>
              <StepLabel {...labelProps}>{step.title}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box sx={{ mt: 4 }}>
        <Outlet />
      </Box>
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
        element: <PlanCreationStepper />,
        children: [
          {
            index: true,
            element: <Navigate to={steps[0].url} replace />,
          },
          {
            path: steps[0].url,
            element: <NamePlan />,
          },
          {
            path: steps[1].url,
            element: <AddItems />,
          },
          {
            path: steps[2].url,
            element: <PredictCompletion />,
          },
          {
            path: steps[3].url,
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
