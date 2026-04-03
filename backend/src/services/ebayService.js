import axios from "axios";

const EBAY_API_URL = "https://api.ebay.com/sell/inventory/v1";
const EBAY_TOKEN = process.env.EBAY_TOKEN; // Ton token OAuth eBay

// Créer une annonce eBay
export const publishToEbay = async (product) => {
  try {
    const response = await axios.post(
      `${EBAY_API_URL}/inventory_item`,
      {
        sku: product._id.toString(),
        product: {
          title: product.title,
          description: product.description,
          aspects: {
            Brand: ["Generic"]
          },
          imageUrls: product.images
        },
        availability: {
          shipToLocationAvailability: {
            quantity: product.quantity
          }
        },
        price: {
          value: product.price,
          currency: "USD"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${EBAY_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (err) {
    throw new Error(`Erreur publication eBay: ${err.message}`);
  }
};