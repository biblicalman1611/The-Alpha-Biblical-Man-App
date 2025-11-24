
import { MemberProfile } from '../types';

// Keys for LocalStorage
const USERS_KEY = 'biblical_man_users';
const CURRENT_USER_KEY = 'biblical_man_current_user';

export interface User {
  id: string;
  email: string;
  passwordHash: string; // In a real app, this would be a secure hash
  name: string;
  profile: MemberProfile;
}

const DEFAULT_PROFILE_IMG = "https://picsum.photos/seed/disciple/200/200?grayscale";

// Helper to get all users
const getUsers = (): Record<string, User> => {
  const usersStr = localStorage.getItem(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : {};
};

// Helper to save users
const saveUsers = (users: Record<string, User>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
  // Register a new user
  register: async (email: string, password: string, name: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getUsers();
    if (users[email]) {
      throw new Error("Account already exists with this email.");
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash: btoa(password), // Simple encoding for demo (NOT secure for production)
      name,
      profile: {
        name: name,
        location: "Unknown Location",
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        imageUrl: DEFAULT_PROFILE_IMG,
        bio: "New member of the congregation. Walking the path."
      }
    };

    users[email] = newUser;
    saveUsers(users);
    
    // Auto login
    localStorage.setItem(CURRENT_USER_KEY, email);
    return newUser;
  },

  // Login existing user
  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getUsers();
    const user = users[email];

    if (!user || user.passwordHash !== btoa(password)) {
      throw new Error("Invalid credentials.");
    }

    localStorage.setItem(CURRENT_USER_KEY, email);
    return user;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get currently logged in user
  getCurrentUser: (): User | null => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    if (!email) return null;
    
    const users = getUsers();
    return users[email] || null;
  },

  // Update user profile
  updateProfile: async (updatedProfile: MemberProfile): Promise<User> => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    if (!email) throw new Error("Not logged in");

    const users = getUsers();
    const user = users[email];
    
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, profile: updatedProfile };
    users[email] = updatedUser;
    saveUsers(users);
    
    return updatedUser;
  }
};
