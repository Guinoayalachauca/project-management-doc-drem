import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import RegisterDocument from './pages/RegisterDocument';
import DocumentSearch from './pages/DocumentSearch';
import Inbox from './pages/Inbox';
import DocumentList from './pages/DocumentList';
import Users from './pages/Users';
import Configuration from './pages/Configuration';
import Login from './pages/Login';
import { User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // If not logged in, show Login page
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Authenticated Layout
  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar onLogout={handleLogout} />
        {/* We need to pass the user down to components via props or context. 
            For this setup, we will just use the Router and assume components might access global state if needed later, 
            or we could wrap them. But Sidebar and Header (inside pages) need to know. 
            Since Header is inside pages, we'll keep it simple for now and rely on the fact 
            that we are authenticated. 
        */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<RegisterDocument />} />
          <Route path="/search" element={<DocumentSearch />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/documents" element={<DocumentList />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Configuration />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;