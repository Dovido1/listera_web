import { generateDescription, suggestPrice } from "../services/aiService.js";

export const optimizeProduct = async (req, res) => {
  try {
    const { title, keywords, basePrice } = req.body;

    const description = await generateDescription(title, keywords);
    const price = await suggestPrice(title, basePrice);

    res.json({ optimizedDescription: description, suggestedPrice: price });
  } catch (err) {
    res.status(500).json({ message: "Erreur optimisation IA", error: err.message });
  }
};