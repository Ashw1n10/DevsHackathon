import React, { useState } from 'react';
import LandingPage from './LandingPage.jsx';
import UserProfile from './UserProfile.jsx';
import Chat from './Chat.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'profile', 'chat'

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'profile':
        return <UserProfile onNavigate={setCurrentPage} />;
      case 'chat':
        return <Chat onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      {renderPage()}
    </div>
  );
}

export default App;
