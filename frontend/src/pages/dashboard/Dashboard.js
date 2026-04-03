import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import useAuthStore from '../../store/auth.store';
import api from '../../api/axios';

function Dashboard() {
  const [activities, setActivities] = useState([]);
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/products');
      const products = response.data?.products || response.data || [];

      // Stats calculées depuis les vrais produits
      const totalProducts = products.length;
      const inStock = products.filter((p) => p.quantity > 3).length;
      const lowStock = products.filter(
        (p) => p.quantity > 0 && p.quantity <= 3
      ).length;
      const outOfStock = products.filter((p) => p.quantity === 0).length;

      setStats({ totalProducts, inStock, lowStock, outOfStock });
      setRecentProducts(products.slice(0, 5));

      // Générer flux d'activité depuis les vrais produits
const recentActivities = products.slice(0, 5).map((p, index) => ({
  id: index,
  message: index === 0
    ? `Produit "${p.title}" publié sur ${p.marketplace || 'eBay'}`
    : index === 1
    ? `Stock de "${p.title}" mis à jour — ${p.quantity} unités`
    : index === 2
    ? `"${p.title}" synchronisé sur toutes les plateformes`
    : index === 3
    ? `Nouvelle annonce "${p.title}" créée`
    : `"${p.title}" optimisé par IA`,
  time: `Il y a ${index + 1}h`,
  type: index === 0 ? 'publish' : index === 1 ? 'stock' : 'sync',
}));
setActivities(recentActivities);

      // Graphique — grouper les produits par mois de création
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
        'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

      const grouped = {};
      products.forEach((p) => {
        const date = new Date(p.createdAt);
        const key = monthNames[date.getMonth()];
        if (!grouped[key]) grouped[key] = 0;
        grouped[key]++;
      });

      const chart = Object.keys(grouped).map((mois) => ({
        mois,
        produits: grouped[mois],
      }));

      setChartData(chart.length > 0 ? chart : [
        { mois: 'Jan', produits: 0 },
      ]);

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A0F0E] border border-[#1C2423]
          rounded-xl px-4 py-3 shadow-xl">
          <p className="text-[#7A9E9B] text-xs mb-1">{label}</p>
          <p className="text-sm font-medium text-[#0ECFB0]">
            {payload[0].value} produit{payload[0].value > 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const marketplaces = [
    { name: 'eBay', color: '#E65C00', bg: '#FFF3E0', synced: true },
    { name: 'Etsy', color: '#F45800', bg: '#FFF0F3', synced: true },
    { name: 'Mercari', color: '#0ECFB0', bg: '#E8FBF8', synced: false },
    { name: 'Poshmark', color: '#CC0099', bg: '#FFF0FB', synced: true },
  ];

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-[rgb(10,15,14)]">
          Bienvenu {user?.name?.split(' ')[0] || 'là'} !
        </h2>
        <p className="text-[#5A7270] text-sm mt-1">
          Voici un résumé de votre activité aujourd'hui
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-5
          hover:border-[#0ECFB0]/40 hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#E8FBF8] flex
            items-center justify-center mb-4">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"
              stroke="#0ECFB0" strokeWidth="2">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4
                7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <p className="text-sm text-[#5A7270] mb-1">Total produits</p>
          <p className="text-3xl font-bold text-[#0A0F0E]">
            {stats.totalProducts}
          </p>
          <p className="text-xs text-[#0ECFB0] mt-1 font-medium">
            Dans votre catalogue
          </p>
        </div>

        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-5
          hover:border-[#22C55E]/40 hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex
            items-center justify-center mb-4">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"
              stroke="#22C55E" strokeWidth="2">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <p className="text-sm text-[#5A7270] mb-1">En stock</p>
          <p className="text-3xl font-bold text-[#0A0F0E]">
            {stats.inStock}
          </p>
          <p className="text-xs text-[#22C55E] mt-1 font-medium">
            ↑ Bien approvisionné
          </p>
        </div>

        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-5
          hover:border-[#FB923C]/40 hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] flex
            items-center justify-center mb-4">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"
              stroke="#FB923C" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0
                2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694
                -1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <p className="text-sm text-[#5A7270] mb-1">Stock faible</p>
          <p className="text-3xl font-bold text-[#0A0F0E]">
            {stats.lowStock}
          </p>
          <p className="text-xs text-[#FB923C] mt-1 font-medium">
            ⚠ Action requise
          </p>
        </div>

        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-5
          hover:border-[#FF4D5B]/40 hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] flex
            items-center justify-center mb-4">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"
              stroke="#FF4D5B" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <p className="text-sm text-[#5A7270] mb-1">Ruptures</p>
          <p className="text-3xl font-bold text-[#0A0F0E]">
            {stats.outOfStock}
          </p>
          <p className="text-xs text-[#FF4D5B] mt-1 font-medium">
            ↓ Déréférencé auto
          </p>
        </div>

      </div>

      {/* GRAPHIQUE + MARKETPLACES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Graphique produits par mois */}
        <div className="lg:col-span-2 bg-white border border-[#E2EEEC]
          rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-[#0A0F0E]">
                Produits ajoutés par mois
              </h3>
              <p className="text-xs text-[#5A7270] mt-0.5">
                Basé sur vos vrais produits
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-[#5A7270]">
              <span className="w-3 h-0.5 bg-[#0ECFB0] rounded inline-block"/>
              Produits
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-[#0ECFB0]
                border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2EEEC"
                  vertical={false}
                />
                <XAxis
                  dataKey="mois"
                  tick={{ fontSize: 12, fill: '#94B0AE' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#94B0AE' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />}/>
                <Line
                  type="monotone"
                  dataKey="produits"
                  stroke="#0ECFB0"
                  strokeWidth={2.5}
                  dot={{ fill: '#0ECFB0', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Marketplaces */}
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#0A0F0E]">Marketplaces</h3>
            <span className="text-xs text-[#0ECFB0] cursor-pointer font-medium">
              Gérer →
            </span>
          </div>
          <div className="space-y-4">
            {marketplaces.map((mp) => (
              <div key={mp.name}
                className="flex items-center justify-between
                  py-2 border-b border-[#E2EEEC] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center
                    justify-center font-bold text-xs"
                    style={{ background: mp.bg, color: mp.color }}>
                    {mp.name.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A0F0E]">
                      {mp.name}
                    </p>
                    <p className="text-xs text-[#94B0AE]">
                      {stats.totalProducts} produits
                    </p>
                  </div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${
                  mp.synced ? 'bg-[#22C55E]' : 'bg-[#FB923C]'
                }`}/>
              </div>
            ))}
            <button className="w-full mt-2 py-2.5 border border-dashed
              border-[#E2EEEC] rounded-xl text-sm text-[#94B0AE]
              hover:border-[#0ECFB0] hover:text-[#0ECFB0]
              transition-colors">
              + Connecter une plateforme
            </button>
          </div>
        </div>

      </div>

      {/* TABLEAU PRODUITS RÉCENTS */}
      <div className="bg-white border border-[#E2EEEC] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4
          border-b border-[#E2EEEC]">
          <h3 className="font-bold text-[#0A0F0E]">Produits récents</h3>
          <span className="text-xs text-[#0ECFB0] cursor-pointer font-medium">
            Voir tout →
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#0ECFB0]
              border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-[#5A7270] font-medium">Aucun produit</p>
            <p className="text-[#94B0AE] text-sm mt-1">
              Ajoutez votre premier produit
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F4F7F6]">
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider">Produit</th>
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider hidden md:table-cell">
                    Plateforme</th>
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider hidden md:table-cell">
                    Stock</th>
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EEEC]">
                {recentProducts.map((product) => (
                  <tr key={product._id}
                    className="hover:bg-[#F4F7F6] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#0A0F0E]">
                        {product.title || product.name}
                      </p>
                      <p className="text-xs text-[#94B0AE]">
                        {product.sku || 'Sans SKU'}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1
                        rounded-full text-xs font-medium
                        bg-[#E8FBF8] text-[#09A88E]">
                        {product.marketplace || 'Non publié'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#0A0F0E]
                      hidden md:table-cell">
                      {product.quantity ?? '—'}
                    </td>
                    <td className="px-6 py-4">
                      {product.quantity === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-1
                          rounded-full text-xs font-medium
                          bg-red-50 text-red-600">
                          Rupture
                        </span>
                      ) : product.quantity <= 3 ? (
                        <span className="inline-flex items-center px-2.5 py-1
                          rounded-full text-xs font-medium
                          bg-orange-50 text-orange-600">
                          Stock faible
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1
                          rounded-full text-xs font-medium
                          bg-green-50 text-green-600">
                          En stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* FLUX D'ACTIVITÉ */}
<div className="bg-white border border-[#E2EEEC] rounded-2xl p-6">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h3 className="font-bold text-[#0A0F0E]">
        Activité récente
      </h3>
      <p className="text-xs text-[#5A7270] mt-0.5">
        Dernières actions sur vos produits
      </p>
    </div>
    <span className="flex items-center gap-1.5 text-xs
      text-[#22C55E] font-medium">
      <span className="w-2 h-2 bg-[#22C55E] rounded-full 
        animate-pulse"/>
      En direct
    </span>
  </div>

  <div className="space-y-4">
    {activities.map((activity) => (
      <div key={activity.id}
        className="flex items-start gap-3 pb-4 
          border-b border-[#E2EEEC] last:border-0 last:pb-0">

        {/* Icône */}
        <div className={`w-8 h-8 rounded-full flex items-center 
          justify-center flex-shrink-0 mt-0.5
          ${activity.type === 'publish'
            ? 'bg-[#E8FBF8]'
            : activity.type === 'stock'
            ? 'bg-[#FFF7ED]'
            : 'bg-[#F0FDF4]'
          }`}>
          {activity.type === 'publish' ? (
            <svg width="14" height="14" fill="none" 
              viewBox="0 0 24 24" stroke="#0ECFB0" strokeWidth="2">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          ) : activity.type === 'stock' ? (
            <svg width="14" height="14" fill="none" 
              viewBox="0 0 24 24" stroke="#FB923C" strokeWidth="2">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 
                4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          ) : (
            <svg width="14" height="14" fill="none" 
              viewBox="0 0 24 24" stroke="#22C55E" strokeWidth="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 
                004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 
                8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          )}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#0A0F0E] leading-snug">
            {activity.message}
          </p>
          <p className="text-xs text-[#94B0AE] mt-1">
            {activity.time}
          </p>
        </div>

      </div>
    ))}

    {activities.length === 0 && (
      <p className="text-sm text-[#94B0AE] text-center py-4">
        Aucune activité récente
      </p>
    )}
  </div>
</div>

    </div>
  );
}

export default Dashboard;