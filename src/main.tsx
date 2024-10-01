// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { createContext, useState, useContext, ReactNode } from 'react';
import { List, ListItem, ListItemText, Checkbox, TextField, Button, Box, Step, StepLabel, Stepper } from '@mui/material';
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

import { Stepper, Step, StepLabel } from '@mui/material';

const PlanForm: React.FC = () => {
  const { plan, setName, addItem, togglePredicted, resetPlan } = usePlanContext();
  const [activeStep, setActiveStep] = useState(0);
  const [newItem, setNewItem] = useState('');

  const steps = ['Name Your Plan', 'Add Items', 'Predict Completion', 'Save Plan'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    resetPlan();
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      addItem(newItem.trim());
      setNewItem('');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <TextField
            fullWidth
            label="Plan Name"
            value={plan.name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
        );
      case 1:
        return (
          <>
            <TextField
              fullWidth
              label="New Item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              margin="normal"
            />
            <Button onClick={handleAddItem} variant="contained" sx={{ mt: 2 }}>
              Add Item
            </Button>
            <List sx={{ mt: 2 }}>
              {plan.items.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </>
        );
      case 2:
        return (
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
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6">Plan Summary</Typography>
            <Typography>Name: {plan.name}</Typography>
            <Typography>Items: {plan.items.length}</Typography>
            <Typography>
              Predicted to complete: {plan.items.filter((item) => item.predicted).length}
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4 }}>
        {activeStep === steps.length ? (
          <>
            <Typography>All steps completed - you're finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 2 }}>
              Reset
            </Button>
          </>
        ) : (
          <>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};



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
        element: <PlanForm />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
