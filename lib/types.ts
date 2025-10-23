export type Role = "SuperAdmin" | "Cliente";

export interface User {
  _id?: string;
  email: string;
  name: string;
  role: Role;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Client {
  _id?: string;
  name: string;
  contactEmail?: string;
  active: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Activity {
  _id?: string;
  userId?: string;
  clientId?: string;
  type: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string | Date;
}


