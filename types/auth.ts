export interface User {
  email: string;
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User | null;
}
