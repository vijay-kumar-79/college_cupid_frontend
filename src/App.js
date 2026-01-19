import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './config/authConfig';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <UnauthenticatedTemplate>
                  <Login />
                </UnauthenticatedTemplate>
                <AuthenticatedTemplate>
                  <Navigate to="/dashboard" replace />
                </AuthenticatedTemplate>
              </>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <>
                <AuthenticatedTemplate>
                  <Dashboard />
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                  <Navigate to="/" replace />
                </UnauthenticatedTemplate>
              </>
            } 
          />
        </Routes>
      </Router>
    </MsalProvider>
  );
}

export default App;