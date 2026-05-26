export interface IUser {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  isLocked: boolean;
  storeId?: number | null;
  storeName?: string | null;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserForm {
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive: boolean;
  storeId?: number | null;
  roleCodes: string[];
}

export interface UserFilter {
  page?: number;
  size?: number;
  username?: string;
  email?: string;
}
