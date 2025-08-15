
import type { TripRequest, User, UserMode } from '../types';

const mockTripRequests: TripRequest[] = [
    { id: 'req-1', from: 'Jalahalli Cross', to: 'Goraguntepalya', time: '07:30 AM' },
    { id: 'req-2', from: 'Peenya 1st Stage', to: 'Majestic Bus Stand', time: '07:45 AM' },
    { id: 'req-3', from: 'Dasarahalli', to: 'Yeshwanthpur', time: '08:00 AM' },
    { id: 'req-4', from: 'Peenya Industrial Area', to: 'Sandal Soap Factory Metro', time: '07:50 AM' },
    { id: 'req-5', from: 'Jalahalli', to: 'Malleshwaram', time: '08:10 AM' },
    { id: 'req-6', from: 'Yeshwanthpur Industry', to: 'Majestic Bus Stand', time: '08:20 AM' },
    { id: 'req-7', from: 'Peenya 2nd Stage', to: 'Rajajinagar', time: '07:55 AM' },
    { id: 'req-8', from: 'TVS Cross', to: 'Okalipuram', time: '08:05 AM' },
];

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
    // Mimic API call
    await delay({}, 1000);
    return {
        id: `user-${Date.now()}`,
        name: name,
        email: email,
        role: role,
    };
};

export const getTripRequests = async (): Promise<TripRequest[]> => {
    return delay(mockTripRequests, 300);
}