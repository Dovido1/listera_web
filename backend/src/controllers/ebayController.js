import Product from "../models/Product.js";
import { publishToEbay } from "../services/ebayService.js";

export const publishProductToEbay = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit introuvable" });

    const result = await publishToEbay(product);
    res.json({ message: "Produit publié sur eBay", result });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};