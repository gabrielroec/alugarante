// types/user.ts
export interface User {
  id: number;
  nome: string;
  foto: string | null;
  isAdmin: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}
