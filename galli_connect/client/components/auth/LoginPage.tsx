import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { login } from '../../services/api';
import { UserMode } from '../../types';
import type { User } from '../../types';
import { NAGARAYATRA_LOGO } from '../../constants';

interface LoginPageProps {
    onLogin: (user: User) => void;
    onSwitchToSignup: () => void;
}

const RoleSelectorButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => {
  const activeClasses = 'bg-primary text-white shadow-sm';
  const inactiveClasses = 'text-slate-600 bg-white hover:bg-slate-50';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-1/2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </button>
  );
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignup }) => {
    const [email, setEmail] = useState('sandha6000@gmail.com');
    const [password, setPassword] = useState('12345678');
    const [role, setRole] = useState<UserMode>(UserMode.PASSENGER);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const user = await login(email, password, role);
            onLogin(user);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid email or password.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-bg-base flex flex-col justify-center items-center p-4">
             <div className="flex flex-col items-center mb-6">
                <NAGARAYATRA_LOGO className="w-40" />
                <h1 className="text-4xl font-bold text-slate-800 tracking-tight mt-2">Nagarayatra</h1>
                <p className="text-slate-500">Making every city ride simple.</p>
            </div>
            <Card className="w-full max-w-md">
                <div className="p-8">
                    <h2 className="text-center text-2xl font-bold text-slate-800 mb-1">Welcome Back!</h2>
                    <p className="text-center text-slate-500 mb-6">Log in to continue.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
                             <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-lg">
                                <RoleSelectorButton
                                    onClick={() => setRole(UserMode.PASSENGER)}
                                    isActive={role === UserMode.PASSENGER}
                                >
                                    Passenger
                                </RoleSelectorButton>
                                <RoleSelectorButton
                                    onClick={() => setRole(UserMode.DRIVER)}
                                    isActive={role === UserMode.DRIVER}
                                >
                                    Driver
                                </RoleSelectorButton>
                            </div>
                        </div>

                        <Input
                            id="email"
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                        <Input
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                         {error && <p className="text-center text-sm text-red-600">{error}</p>}
                        <Button type="submit" isLoading={isLoading} className="w-full">
                            Log In
                        </Button>
                    </form>
                </div>
                <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                        Don't have an account?{' '}
                        <button onClick={onSwitchToSignup} className="font-medium text-primary hover:text-primary-hover">
                            Sign up
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
};