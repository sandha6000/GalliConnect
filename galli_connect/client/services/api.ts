
import type { TripRequest, User, UserMode } from '../types';



// Simulate network latency
const delay = <T,>(data: T, ms = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
};

export const login = async (
    email: string,
    password: string,
    role: UserMode
): Promise<User> => {
    console.log(`Attempting to log in user: ${email} as ${role}`);

    if (!email || !password || password.length < 1) {
        throw new Error('Invalid credentials');
    }

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    return data as User;
};


export const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserMode
): Promise<User> => {
    console.log(`Attempting to sign up user: ${name} (${email}) as ${role}`);

    if (!name || !email || !password || password.length < 1) {
        throw new Error('Name, email, and password are required');
    }

    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Signup failed');
    }

    const data = await response.json();
    return data as User;
};

export const findShuttles = async (from: string, to: string): Promise<Shuttle[]> => {
  console.log(`Searching for shuttles from ${from} to ${to}`);
  const results = mockShuttles.filter(s => s.route[0].toLowerCase().includes(from.toLowerCase()) && s.route[1].toLowerCase().includes(to.toLowerCase()));
  return delay(results, 800);
};

export const getTripRequests = async (): Promise<TripRequest[]> => {
    return delay(mockTripRequests, 300);
}