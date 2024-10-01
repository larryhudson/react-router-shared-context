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
