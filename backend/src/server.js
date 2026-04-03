import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import ebayRoutes from "./routes/ebay.js";
import marketplaceRoutes from "./routes/marketplaces.js";
import aiRoutes from "./routes/ai.js";
import uploadRoutes from "./routes/upload.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors()); //autorise les requetes depuis le frontend
// Servir les fichiers statiques (images uploadées)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ebay", ebayRoutes);
app.use("/api/marketplaces", marketplaceRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/upload", uploadRoutes);


app.get("/", (req, res) => {
  res.send("API LISTERA opérationnelle ");
});

// Connexion DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connecté à MongoDB avec succès !"))
  .catch(err => console.error("Erreur de connexion :", err));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));