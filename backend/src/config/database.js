import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test de connexion au démarrage
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erreur de connexion à PostgreSQL:', err.message);
  } else {
    console.log('✅ Connecté à la base de données PostgreSQL');
    release();
  }
});

// Gestion des erreurs
pool.on('error', (err) => {
  console.error('❌ Erreur PostgreSQL:', err);
});

export default pool;