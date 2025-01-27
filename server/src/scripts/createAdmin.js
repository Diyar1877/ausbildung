import dotenv from 'dotenv';
import User from '../models/User.js';
import sequelize from '../config/database.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    await sequelize.sync();

    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin-Benutzer erfolgreich erstellt:', {
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });

    process.exit(0);
  } catch (error) {
    console.error('Fehler beim Erstellen des Admin-Benutzers:', error);
    process.exit(1);
  }
};

createAdminUser();
