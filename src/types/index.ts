export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Metric {
  id: string;
  label: string;
  value: number;
  category: string | null;
  createdAt: string;
}