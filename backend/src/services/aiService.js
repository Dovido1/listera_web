import axios from "axios";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_KEY = process.env.OPENAI_KEY;

export const generateDescription = async (title, keywords) => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Tu es un assistant qui écrit des descriptions de produits attrayantes." },
          { role: "user", content: `Produit: ${title}. Mots-clés: ${keywords}. Génère une description marketing.` }
        ],
        max_tokens: 150
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    throw new Error(`Erreur génération description: ${err.message}`);
  }
};

export const suggestPrice = async (title, basePrice) => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Tu es un assistant qui suggère des prix compétitifs." },
          { role: "user", content: `Produit: ${title}. Prix de base: ${basePrice}. Donne un prix optimal.` }
        ],
        max_tokens: 50
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    throw new Error(`Erreur suggestion prix: ${err.message}`);
  }
};