import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AppsPage from './pages/AppsPage';
import AppDetailsPage from './pages/AppDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import DeveloperPage from './pages/DeveloperPage';
import Footer from './components/Footer';

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/apps" element={<AppsPage />} />
                  <Route path="/apps/:slug" element={<AppDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/developer" element={<DeveloperPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;