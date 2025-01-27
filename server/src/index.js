import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routen
app.use('/api/auth', authRoutes);
app.use('/subjects', subjectRoutes);

// Datenbank-Synchronisation und Server-Start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('Datenbank erfolgreich synchronisiert');
    
    app.listen(PORT, () => {
      console.log(`Server läuft auf Port ${PORT}`);
    });
  } catch (error) {
    console.error('Server-Startfehler:', error);
  }
};

startServer();
