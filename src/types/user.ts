export interface IUser {
  uid: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'blocked';
  preferences: {
    theme: string;
    notifications: boolean;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}