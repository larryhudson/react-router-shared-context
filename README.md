# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# React Context State Sharing Example

This project demonstrates a simple example of how to use React Context to share state variables between multiple view components in a client-side application.

## Overview

React Context provides a way to pass data through the component tree without having to pass props down manually at every level. This project showcases how to:

1. Create a context for a plan with items
2. Provide the context to child components
3. Consume the context in various components to access and modify shared state

## Key Features

- Shared state management using React Context
- Add, toggle, and reset plan items
- Demonstrate how to update context from child components

## Project Structure

The main components of this project are:

- `src/main.tsx`: Entry point of the application, sets up the React app with the PlanProvider
- `PlanContext.tsx`: Defines the Plan context and provides the PlanProvider component
- Various view components that consume the PlanContext

## How It Works

1. The `PlanContext` is created with an initial state and functions to modify the state.
2. The `PlanProvider` wraps the main application, making the context available to all child components.
3. Child components use the `useContext` hook to access the shared state and functions from the PlanContext.
4. Components can read the current state and call functions to update it, which will automatically re-render any components that depend on that state.

## Benefits

- Simplifies state management in complex component trees
- Reduces prop drilling
- Provides a centralized place for state logic
- Makes it easy to share and update state across multiple components

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`

This project serves as a great starting point for understanding how to implement shared state management in React applications using Context.
