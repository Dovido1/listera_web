import Product from "../models/Product.js";

// Ajouter un produit
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, marketplace, images } = req.body;
    const newProduct = new Product({
      title,
      description,
      price,
      quantity,
      marketplace,
      images: images || [],
      userId: req.user.id
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Récupérer tous les produits de l’utilisateur
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Mettre à jour un produit
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Vérification stock après mise à jour
    if (updated && req.body.quantity !== undefined) {
      const user = await User.findById(req.user.id);

      if (updated.quantity === 0) {
        // Rupture de stock
        try {
          await sendOutOfStockEmail(
            user.email,
            user.name,
            updated.title
          );
        } catch (emailError) {
          console.error('Erreur email rupture:', emailError);
        }
      } else if (updated.quantity <= 3) {
        // Stock faible
        try {
          await sendLowStockEmail(
            user.email,
            user.name,
            updated.title,
            updated.quantity
          );
        } catch (emailError) {
          console.error('Erreur email stock faible:', emailError);
        }
      }
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Supprimer un produit
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};