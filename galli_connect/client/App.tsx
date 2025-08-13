
import React, { useState } from 'react';
import { UserMode } from './types';
import type { User } from './types';
import { PassengerView } from './components/PassengerView';
import { DriverView } from './components/DriverView';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { BUS_ICON, LOGOUT_ICON } from './constants';
import { Button } from './components/common/Button';

const Header: React.FC<{
  currentUser: User | null;
  onLogout: () => void;
}> = ({ currentUser, onLogout }) => {
    if (!currentUser) return null;

    const getDashboardName = () => {
        if (currentUser.role === UserMode.DRIVER) return "Driver Dashboard";
        if (currentUser.role === UserMode.PASSENGER) return "Passenger View";
        return "Dashboard";
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center text-2xl font-bold text-indigo-600">
                    {BUS_ICON}
                    <span className="ml-2 hidden sm:inline">Local Commute</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                     <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                        {getDashboardName()}
                    </span>
                    <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 hidden md:block">
                            Hi, <span className="font-medium">{currentUser?.name.split(' ')[0]}</span>
                        </span>
                        <Button onClick={onLogout} variant="ghost" className="px-2 py-2 text-sm">
                            <div className="flex items-center gap-1.5">
                                {LOGOUT_ICON}
                                <span className="hidden sm:inline">Logout</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

type View = 'login' | 'signup';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // The view after login is determined by the user's role, not a separate state.
  };

  const handleSignup = (user: User) => {
    setCurrentUser(user);
    // The view after signup is also determined by the user's role.
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
  };
  
  if (currentUser) {
      const dashboard = currentUser.role === UserMode.PASSENGER 
          ? <PassengerView /> 
          : <DriverView />;
      
      return (
          <div className="min-h-screen bg-slate-100">
              <Header currentUser={currentUser} onLogout={handleLogout} />
              <main>
                  {dashboard}
              </main>
          </div>
      );
  }

  // No user, show login or signup page
  switch(view) {
      case 'signup':
          return <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setView('login')} />;
      case 'login':
      default:
          return <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setView('signup')} />;
  }
};

export default App;
