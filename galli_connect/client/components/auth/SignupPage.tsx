
import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { signup } from '../../services/api';
import { UserMode } from '../../types';
import type { User } from '../../types';
import { BUS_ICON } from '../../constants';

interface SignupPageProps {
    onSignup: (user: User) => void;
    onSwitchToLogin: () => void;
}

const RoleSelectorButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => {
  const activeClasses = 'bg-indigo-600 text-white shadow-sm';
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

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserMode>(UserMode.PASSENGER);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const user = await signup(name, email, password, role);
            onSignup(user);
        } catch (err) {
             setError(err instanceof Error ? err.message : 'Failed to create an account.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
             <div className="flex items-center text-3xl font-bold text-indigo-600 mb-6">
                {BUS_ICON}
                <span className="ml-2">Local Commute</span>
            </div>
            <Card className="w-full max-w-md">
                <div className="p-8">
                    <h2 className="text-center text-2xl font-bold text-slate-800 mb-1">Create an Account</h2>
                    <p className="text-center text-slate-500 mb-6">Join to simplify your daily travel.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                         <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">I want to sign up as a...</label>
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
                            id="name"
                            label="Full Name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            autoComplete="name"
                        />
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
                            autoComplete="new-password"
                        />
                         {error && <p className="text-center text-sm text-red-600">{error}</p>}
                        <Button type="submit" isLoading={isLoading} className="w-full">
                            Sign Up
                        </Button>
                    </form>
                </div>
                <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <button onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                            Log in
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
};