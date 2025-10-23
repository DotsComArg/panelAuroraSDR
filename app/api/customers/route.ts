import { NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';
import { Customer, CreateCustomerDto } from '@/lib/customer-types';

export const dynamic = 'force-dynamic';

// GET /api/customers - Obtener todos los clientes
export async function GET() {
  try {
    const db = await getMongoDb();
    const customers = await db
      .collection<Customer>('customers')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: customers.map(customer => ({
        ...customer,
        _id: customer._id?.toString()
      }))
    });
  } catch (error) {
    console.error('Error al obtener customers:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener clientes' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Crear un nuevo cliente
export async function POST(request: Request) {
  try {
    const body: CreateCustomerDto = await request.json();

    // Validaciones básicas
    if (!body.nombre || !body.apellido || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const db = await getMongoDb();
    
    // Verificar si el email ya existe
    const existingCustomer = await db
      .collection<Customer>('customers')
      .findOne({ email: body.email });

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    const newCustomer: Omit<Customer, '_id'> = {
      nombre: body.nombre,
      apellido: body.apellido,
      email: body.email,
      telefono: body.telefono,
      pais: body.pais,
      cantidadAgentes: body.cantidadAgentes || 1,
      planContratado: body.planContratado || 'Básico',
      fechaInicio: new Date(body.fechaInicio),
      twoFactorAuth: body.twoFactorAuth || false,
      rol: body.rol || 'Cliente',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db
      .collection<Customer>('customers')
      .insertOne(newCustomer as any);

    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId.toString(),
        ...newCustomer
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear customer:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear cliente' },
      { status: 500 }
    );
  }
}

