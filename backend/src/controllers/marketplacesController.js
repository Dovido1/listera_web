import Product from "../models/Product.js";
import { publishToEtsy } from "../services/etsyService.js";

export const publishProductToEtsy = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit introuvable" });

    const result = await publishToEtsy(product);
    res.json({ message: "Produit publié sur Etsy", result });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};