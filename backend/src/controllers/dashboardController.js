import pool from '../config/database.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Stats produits
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'active')  AS annonces_actives,
        COUNT(*) FILTER (WHERE stock = 0)          AS ruptures_stock
      FROM products
      WHERE user_id = $1
    `, [userId]);

    // Revenus ce mois
    const revenueResult = await pool.query(`
      SELECT COALESCE(SUM(l.price * l.sales), 0) AS revenus_mois
      FROM listings l
      WHERE l.user_id = $1
        AND l.updated_at >= date_trunc('month', NOW())
    `, [userId]);

    // Ventes aujourd'hui
    const salesTodayResult = await pool.query(`
      SELECT COALESCE(SUM(sales), 0) AS ventes_jour
      FROM listings
      WHERE user_id = $1
        AND updated_at >= CURRENT_DATE
    `, [userId]);

    // Stats par marketplace
    const marketplaceResult = await pool.query(`
      SELECT
        l.marketplace,
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE l.status = 'active') AS actifs,
        COALESCE(SUM(l.sales), 0) AS ventes
      FROM listings l
      WHERE l.user_id = $1
      GROUP BY l.marketplace
      ORDER BY actifs DESC
    `, [userId]);

    // Activité récente (derniers listings modifiés)
    const activityResult = await pool.query(`
      SELECT
        l.marketplace,
        l.status,
        l.updated_at,
        p.title
      FROM listings l
      JOIN products p ON l.product_id = p.id
      WHERE l.user_id = $1
      ORDER BY l.updated_at DESC
      LIMIT 5
    `, [userId]);

    // Répartition des ventes par marketplace (pour le graphique)
    const salesBreakdownResult = await pool.query(`
      SELECT
        marketplace,
        COALESCE(SUM(sales), 0) AS total_ventes
      FROM listings
      WHERE user_id = $1
      GROUP BY marketplace
    `, [userId]);

    const totalVentes = salesBreakdownResult.rows.reduce(
      (acc, r) => acc + parseInt(r.total_ventes), 0
    );

    const salesBreakdown = salesBreakdownResult.rows.map(r => ({
      label: r.marketplace,
      pct: totalVentes > 0
        ? Math.round((parseInt(r.total_ventes) / totalVentes) * 100)
        : 0,
    }));

    // Revenus des 30 derniers jours (pour le graphique)
    const revenueChartResult = await pool.query(`
      SELECT
        DATE(l.updated_at) AS date,
        COALESCE(SUM(l.price * l.sales), 0) AS revenus
      FROM listings l
      WHERE l.user_id = $1
        AND l.updated_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(l.updated_at)
      ORDER BY date ASC
    `, [userId]);

    const stats = statsResult.rows[0];
    const revenue = revenueResult.rows[0];
    const salesToday = salesTodayResult.rows[0];

    res.json({
      stats: {
        revenus_mois:     parseFloat(revenue.revenus_mois) || 0,
        annonces_actives: parseInt(stats.annonces_actives) || 0,
        ventes_jour:      parseInt(salesToday.ventes_jour) || 0,
        ruptures_stock:   parseInt(stats.ruptures_stock) || 0,
      },
      marketplaces:    marketplaceResult.rows,
      activities:      activityResult.rows,
      salesBreakdown,
      revenueChart:    revenueChartResult.rows,
    });

  } catch (error) {
    console.error('Erreur dashboard:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du dashboard' });
  }
};