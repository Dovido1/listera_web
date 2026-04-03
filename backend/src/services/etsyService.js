import axios from "axios";

const ETSY_API_URL = "https://openapi.etsy.com/v3/application";
const ETSY_TOKEN = process.env.ETSY_TOKEN; // Ton token OAuth Etsy

// Publier un produit sur Etsy
export const publishToEtsy = async (product) => {
  try {
    const response = await axios.post(
      `${ETSY_API_URL}/listings`,
      {
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        who_made: "i_did",
        when_made: "2020_2022",
        is_supply: false,
        taxonomy_id: 1, // Exemple : catégorie générique
        images: product.images
      },
      {
        headers: {
          Authorization: `Bearer ${ETSY_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (err) {
    throw new Error(`Erreur publication Etsy: ${err.message}`);
  }
};