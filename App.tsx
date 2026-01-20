
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
import Statistics from './pages/Statistics';
import NotificationHistory from './pages/NotificationHistory';
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
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <SidebarProvider>
      <HashRouter>
        <div className="min-h-screen bg-[#f8fafc] flex">
          <Sidebar onLogout={handleLogout} />
          <div className="flex-1 w-full md:ml-64 transition-all duration-300 min-h-screen flex flex-col">
            <Routes>
              {/* Ruta raíz es Dashboard */}
              <Route path="/" element={<Dashboard currentUser={currentUser} onLogout={handleLogout} />} />
              <Route path="/register" element={<RegisterDocument onLogout={handleLogout} currentUser={currentUser} />} />
              <Route path="/search" element={<DocumentSearch onLogout={handleLogout} currentUser={currentUser} />} />
              <Route path="/inbox" element={<Inbox onLogout={handleLogout} currentUser={currentUser} />} />
              <Route path="/documents" element={<DocumentList onLogout={handleLogout} currentUser={currentUser} />} />
              <Route path="/users" element={<Users onLogout={handleLogout} currentUser={currentUser} />} />
              <Route path="/settings" element={<Configuration currentUser={currentUser} onLogout={handleLogout} />} />
              <Route path="/profile" element={<Profile currentUser={currentUser} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />} />
              <Route path="/statistics" element={<Statistics currentUser={currentUser} onLogout={handleLogout} />} />
              <Route path="/notifications" element={<NotificationHistory currentUser={currentUser} onLogout={handleLogout} />} />
              
              {/* Cualquier ruta desconocida vuelve al Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </SidebarProvider>
  );
};

export default App;
