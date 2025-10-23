import { MongoClient } from 'mongodb';

const MONGODB_URI = "mongodb+srv://admin:admin@cluster01.pxbkzd4.mongodb.net/";
const DB_NAME = "AuroraSDR";

async function initCustomers() {
  console.log('🔄 Inicializando base de datos de customers...\n');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB\n');

    const db = client.db(DB_NAME);
    const customersCollection = db.collection('customers');

    // Verificar si ya existen customers
    const existingCount = await customersCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Ya existen ${existingCount} customers en la base de datos.`);
      console.log('   ¿Deseas continuar? Esto agregará más customers.');
      console.log('   Para limpiar y reiniciar, ejecuta primero: npm run clean-customers\n');
    }

    // Customer 1: Aurora SDR IA (Owner)
    const ownerCustomer = {
      nombre: 'Aurora',
      apellido: 'SDR IA',
      email: 'admin@aurorasdr.ai',
      telefono: '+1 555-0100',
      pais: 'Argentina',
      cantidadAgentes: 100, // Sin límite para owners
      planContratado: 'Custom',
      fechaInicio: new Date('2024-01-01'),
      twoFactorAuth: true,
      rol: 'Owner',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Customer 2: Academia MAV (Cliente)
    const clientCustomer = {
      nombre: 'Academia',
      apellido: 'MAV',
      email: 'contacto@academiamav.com',
      telefono: '+52 55-1234-5678',
      pais: 'México',
      cantidadAgentes: 1,
      planContratado: 'Profesional',
      fechaInicio: new Date('2024-02-15'),
      twoFactorAuth: false,
      rol: 'Cliente',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insertar customers
    console.log('📝 Insertando customers...\n');

    const ownerResult = await customersCollection.insertOne(ownerCustomer);
    console.log(`✅ Owner creado: ${ownerResult.insertedId}`);
    console.log(`   - Nombre: ${ownerCustomer.nombre} ${ownerCustomer.apellido}`);
    console.log(`   - Email: ${ownerCustomer.email}`);
    console.log(`   - Rol: ${ownerCustomer.rol}\n`);

    const clientResult = await customersCollection.insertOne(clientCustomer);
    console.log(`✅ Cliente creado: ${clientResult.insertedId}`);
    console.log(`   - Nombre: ${clientCustomer.nombre} ${clientCustomer.apellido}`);
    console.log(`   - Email: ${clientCustomer.email}`);
    console.log(`   - Rol: ${clientCustomer.rol}`);
    console.log(`   - Agentes: ${clientCustomer.cantidadAgentes}`);
    console.log(`   - Plan: ${clientCustomer.planContratado}\n`);

    // Crear índices
    console.log('🔍 Creando índices...');
    await customersCollection.createIndex({ email: 1 }, { unique: true });
    await customersCollection.createIndex({ rol: 1 });
    await customersCollection.createIndex({ createdAt: -1 });
    console.log('✅ Índices creados\n');

    console.log('🎉 Base de datos inicializada correctamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - Total customers: ${await customersCollection.countDocuments()}`);
    console.log(`   - Owners: ${await customersCollection.countDocuments({ rol: 'Owner' })}`);
    console.log(`   - Clientes: ${await customersCollection.countDocuments({ rol: 'Cliente' })}`);

  } catch (error) {
    console.error('❌ Error al inicializar customers:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Conexión cerrada');
  }
}

initCustomers();

