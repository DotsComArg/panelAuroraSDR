import { ObjectId } from 'mongodb';

export interface Customer {
  _id?: ObjectId;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  pais: string;
  cantidadAgentes: number;
  planContratado: 'Básico' | 'Profesional' | 'Enterprise' | 'Custom';
  fechaInicio: Date;
  twoFactorAuth: boolean;
  rol: 'Cliente' | 'Owner';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  pais: string;
  cantidadAgentes: number;
  planContratado: 'Básico' | 'Profesional' | 'Enterprise' | 'Custom';
  fechaInicio: string; // ISO string
  twoFactorAuth: boolean;
  rol: 'Cliente' | 'Owner';
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {
  _id: string;
}

