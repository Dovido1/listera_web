import pool from '../config/database.js';

export const getListings = async (req, res) => {
  try {
    const { marketplace, status, limit = 20, offset = 0 } = req.query;
    let query = `SELECT l.*, p.title, p.images, p.base_price, p.stock, p.sku, p.category FROM listings l JOIN products p ON l.product_id = p.id WHERE l.user_id = $1`;
    const params = [req.userId];
    let idx = 2;
    if (marketplace) { query += ` AND l.marketplace = $${idx}`; params.push(marketplace); idx++; }
    if (status) { query += ` AND l.status = $${idx}`; params.push(status); idx++; }
    query += ` ORDER BY l.updated_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
    params.push(parseInt(limit), parseInt(offset));
    const result = await pool.query(query, params);
    res.json({ listings: result.rows, count: result.rows.length });
  } catch (error) {
    res.status(500).json({ error: 'Erreur récupération annonces' });
  }
};

export const createListing = async (req, res) => {
  try {
    const { product_id, marketplace, price } = req.body;
    if (!product_id || !marketplace) {
      return res.status(400).json({ error: 'product_id et marketplace requis' });
    }
    const productCheck = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND user_id = $2',
      [product_id, req.userId]
    );
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    const product = productCheck.rows[0];
    const result = await pool.query(
      `INSERT INTO listings (product_id, user_id, marketplace, title, price, status)
       VALUES ($1, $2, $3, $4, $5, 'draft')
       ON CONFLICT (product_id, marketplace) DO UPDATE SET price = $5, updated_at = NOW()
       RETURNING *`,
      [product_id, req.userId, marketplace, product.title, price || product.base_price]
    );
    res.status(201).json({ message: 'Annonce créée', listing: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erreur création annonce' });
  }
};

export const getListing = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT l.*, p.title, p.images, p.base_price, p.stock, p.sku
       FROM listings l
       JOIN products p ON l.product_id = p.id
       WHERE l.id = $1 AND l.user_id = $2`,
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }
    res.json({ listing: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erreur récupération annonce' });
  }
};

export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, status, title } = req.body;
    const result = await pool.query(
      `UPDATE listings
       SET price = COALESCE($1, price), status = COALESCE($2, status), title = COALESCE($3, title), updated_at = NOW()
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [price, status, title, id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }
    res.json({ message: 'Annonce mise à jour', listing: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erreur mise à jour annonce' });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM listings WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }
    res.json({ message: 'Annonce supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur suppression annonce' });
  }
};

export const publishListing = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE listings SET status = 'active', updated_at = NOW()
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }
    res.json({ message: 'Annonce publiée', listing: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erreur publication annonce' });
  }
};

export const syncListings = async (req, res) => {
  try {
    await pool.query(
      `UPDATE listings SET last_synced_at = NOW(), updated_at = NOW()
       WHERE user_id = $1 AND status = 'active'`,
      [req.userId]
    );
    await pool.query(
      `UPDATE listings l SET status = 'out_of_stock', updated_at = NOW()
       FROM products p
       WHERE l.product_id = p.id AND l.user_id = $1 AND p.stock = 0 AND l.status = 'active'`,
      [req.userId]
    );
    res.json({ message: 'Synchronisation terminée', synced_at: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Erreur synchronisation' });
  }
};