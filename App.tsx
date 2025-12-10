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
import Profile from './pages/Profile';
import Login from './pages/Login';
import { User } from './types';
import { SidebarProvider } from './contexts/SidebarContext';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    // If the currently logged in user updates their own profile, update state
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  };

  // If not logged in, show Login page
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Authenticated Layout
  return (
    <SidebarProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-50 flex">
          <Sidebar onLogout={handleLogout} />
          {/* Main Layout Container: Adjusts margin on desktop, full width on mobile */}
          <div className="flex-1 w-full md:ml-64 transition-all duration-300 min-h-screen flex flex-col">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/register" element={<RegisterDocument />} />
              <Route path="/search" element={<DocumentSearch />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/documents" element={<DocumentList />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Configuration currentUser={currentUser} />} />
              <Route path="/profile" element={<Profile currentUser={currentUser} onUpdateUser={handleUpdateUser} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </SidebarProvider>
  );
};

export default App;