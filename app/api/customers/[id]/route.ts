import { NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';
import { Customer, UpdateCustomerDto } from '@/lib/customer-types';
import { ObjectId } from 'mongodb';

// GET /api/customers/[id] - Obtener un cliente específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    const db = await getMongoDb();
    const customer = await db
      .collection<Customer>('customers')
      .findOne({ _id: new ObjectId(id) });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...customer,
        _id: customer._id?.toString()
      }
    });
  } catch (error) {
    console.error('Error al obtener customer:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener cliente' },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id] - Actualizar un cliente
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateCustomerDto = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    const db = await getMongoDb();

    // Preparar campos a actualizar
    const updateFields: Partial<Customer> = {
      updatedAt: new Date()
    };

    if (body.nombre) updateFields.nombre = body.nombre;
    if (body.apellido) updateFields.apellido = body.apellido;
    if (body.email) updateFields.email = body.email;
    if (body.telefono) updateFields.telefono = body.telefono;
    if (body.pais) updateFields.pais = body.pais;
    if (body.cantidadAgentes !== undefined) updateFields.cantidadAgentes = body.cantidadAgentes;
    if (body.planContratado) updateFields.planContratado = body.planContratado;
    if (body.fechaInicio) updateFields.fechaInicio = new Date(body.fechaInicio);
    if (body.twoFactorAuth !== undefined) updateFields.twoFactorAuth = body.twoFactorAuth;
    if (body.rol) updateFields.rol = body.rol;

    const result = await db
      .collection<Customer>('customers')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateFields },
        { returnDocument: 'after' }
      );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        _id: result._id?.toString()
      }
    });
  } catch (error) {
    console.error('Error al actualizar customer:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar cliente' },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Eliminar un cliente
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      );
    }

    const db = await getMongoDb();
    const result = await db
      .collection<Customer>('customers')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cliente eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar customer:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar cliente' },
      { status: 500 }
    );
  }
}

