
import type { Shuttle, Booking, TripRequest, User, UserMode } from '../types';

const mockShuttles: Shuttle[] = [
  {
    id: 'shuttle-001',
    name: 'Ganga Express',
    driverName: 'Ramesh Kumar',
    departureTime: '08:00 AM',
    arrivalTime: '09:15 AM',
    availableSeats: 8,
    totalSeats: 12,
    price: 50,
    route: ['Peenya Industrial Area', 'Majestic Bus Stand'],
  },
  {
    id: 'shuttle-002',
    name: 'Yamuna Travels',
    driverName: 'Suresh Singh',
    departureTime: '08:30 AM',
    arrivalTime: '09:45 AM',
    availableSeats: 3,
    totalSeats: 12,
    price: 55,
    route: ['Peenya Industrial Area', 'Majestic Bus Stand'],
  },
  {
    id: 'shuttle-003',
    name: 'Cauvery Connect',
    driverName: 'Manjunath',
    departureTime: '09:00 AM',
    arrivalTime: '09:50 AM',
    availableSeats: 10,
    totalSeats: 10,
    price: 45,
    route: ['Electronic City', 'Marathahalli'],
  },
  {
    id: 'shuttle-004',
    name: 'Silicon Valley Rider',
    driverName: 'Anand',
    departureTime: '09:15 AM',
    arrivalTime: '10:00 AM',
    availableSeats: 5,
    totalSeats: 10,
    price: 50,
    route: ['Electronic City', 'Marathahalli'],
  },
];

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

export const bookSeat = async (shuttleId: string, seats: number): Promise<Booking> => {
  const shuttle = mockShuttles.find(s => s.id === shuttleId);
  if (!shuttle) {
    throw new Error('Shuttle not found');
  }
  const booking: Booking = {
    bookingId: `BK-${Date.now()}`,
    shuttle,
    seats,
    totalPrice: shuttle.price * seats,
  };
  return delay(booking, 1000);
};

export const getTripRequests = async (): Promise<TripRequest[]> => {
    return delay(mockTripRequests, 300);
}