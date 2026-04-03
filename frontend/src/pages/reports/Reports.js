/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../api/axios';

function Reports() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('6mois');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/api/products');
      const data = response.data?.products || response.data || [];
      setProducts(data);
    } catch (error) {
      console.error('Erreur chargement rapports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stats calculées depuis les vrais produits
  const totalProducts = products.length;
  const inStock = products.filter((p) => p.quantity > 3).length;
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= 3).length;
  
  /* eslint-disable no-unused-vars */
  const outOfStock = products.filter((p) => p.quantity === 0).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.quantity || 0), 0);

  // Graphique — produits par mois
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  const grouped = {};
  products.forEach((p) => {
    const date = new Date(p.createdAt);
    const key = monthNames[date.getMonth()];
    if (!grouped[key]) grouped[key] = { mois: key, produits: 0, valeur: 0 };
    grouped[key].produits++;
    grouped[key].valeur += p.price * p.quantity || 0;
  });

  const chartData = Object.values(grouped).length > 0
    ? Object.values(grouped)
    : [{ mois: 'Jan', produits: 0, valeur: 0 }];

  // Répartition par marketplace
  const marketplaceGroups = {};
  products.forEach((p) => {
    const mp = p.marketplace || 'Non publié';
    if (!marketplaceGroups[mp]) marketplaceGroups[mp] = 0;
    marketplaceGroups[mp]++;
  });

  const platformData = Object.keys(marketplaceGroups).map((name) => ({
    name,
    count: marketplaceGroups[name],
    percent: Math.round((marketplaceGroups[name] / totalProducts) * 100),
  }));

  const platformColors = {
    'eBay': '#E65C00',
    'Etsy': '#F45800',
    'Mercari': '#0ECFB0',
    'Poshmark': '#CC0099',
    'Facebook': '#1877F2',
    'Non publié': '#94B0AE',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A0F0E] border border-[#1C2423]
          rounded-xl px-4 py-3 shadow-xl">
          <p className="text-[#7A9E9B] text-xs mb-2">{label}</p>
          {payload.map((entry) => (
            <p key={entry.name} className="text-sm font-medium"
              style={{ color: entry.color }}>
              {entry.name === 'produits' ? 'Produits' : 'Valeur ($)'} : {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="hidden lg:block">
          <h2 className="text-2xl font-bold text-[#0A0F0E]">Rapports</h2>
          <p className="text-sm text-[#5A7270] mt-1">
            Analysez vos performances en temps réel
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { key: '1mois', label: '1 mois' },
            { key: '3mois', label: '3 mois' },
            { key: '6mois', label: '6 mois' },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-2 rounded-xl text-sm font-medium
                transition-all duration-200
                ${period === p.key
                  ? 'bg-[#0ECFB0] text-[#0A0F0E]'
                  : 'bg-white border border-[#E2EEEC] text-[#5A7270] hover:border-[#0ECFB0]'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats réelles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-5">
          <p className="text-xs text-[#5A7270] mb-1">Total produits</p>
          <p className="text-3xl font-bold text-[#0A0F0E]">{totalProducts}</p>
          <p className="text-xs text-[#0ECFB0] mt-1 font-medium">
            Dans le catalogue
          </p>
        </div>
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-5">
          <p className="text-xs text-[#5A7270] mb-1">En stock</p>
          <p className="text-3xl font-bold text-[#22C55E]">{inStock}</p>
          <p className="text-xs text-[#22C55E] mt-1 font-medium">
            ↑ Disponibles
          </p>
        </div>
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-5">
          <p className="text-xs text-[#5A7270] mb-1">Valeur totale</p>
          <p className="text-3xl font-bold text-[#0A0F0E]">
            ${totalValue.toLocaleString()}
          </p>
          <p className="text-xs text-[#0ECFB0] mt-1 font-medium">
            Stock × Prix
          </p>
        </div>
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-5">
          <p className="text-xs text-[#5A7270] mb-1">Stock faible</p>
          <p className="text-3xl font-bold text-[#FB923C]">{lowStock}</p>
          <p className="text-xs text-[#FB923C] mt-1 font-medium">
            ⚠ À réapprovisionner
          </p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Produits par mois */}
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-6">
          <h3 className="font-bold text-[#0A0F0E] mb-1">
            Produits ajoutés
          </h3>
          <p className="text-xs text-[#5A7270] mb-6">Par mois</p>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-[#0ECFB0]
                border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2EEEC" vertical={false}/>
                <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#94B0AE' }}
                  axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 12, fill: '#94B0AE' }}
                  axisLine={false} tickLine={false} allowDecimals={false}/>
                <Tooltip content={<CustomTooltip />}/>
                <Line type="monotone" dataKey="produits" stroke="#0ECFB0"
                  strokeWidth={2.5}
                  dot={{ fill: '#0ECFB0', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}/>
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Valeur par mois */}
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-6">
          <h3 className="font-bold text-[#0A0F0E] mb-1">
            Valeur du stock
          </h3>
          <p className="text-xs text-[#5A7270] mb-6">En dollars ($)</p>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-[#0ECFB0]
                border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2EEEC" vertical={false}/>
                <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#94B0AE' }}
                  axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 12, fill: '#94B0AE' }}
                  axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip />}/>
                <Bar dataKey="valeur" fill="#0ECFB0" radius={[6, 6, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* Répartition par plateforme */}
      <div className="bg-white border border-[#E2EEEC] rounded-2xl p-6">
        <h3 className="font-bold text-[#0A0F0E] mb-6">
          Répartition par plateforme
        </h3>
        {platformData.length === 0 ? (
          <p className="text-[#94B0AE] text-sm">Aucune donnée disponible</p>
        ) : (
          <div className="space-y-4">
            {platformData.map((platform) => (
              <div key={platform.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-[#0A0F0E]">
                    {platform.name}
                  </span>
                  <span className="text-sm text-[#5A7270]">
                    {platform.count} produit{platform.count > 1 ? 's' : ''} ({platform.percent}%)
                  </span>
                </div>
                <div className="h-2 bg-[#F4F7F6] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${platform.percent}%`,
                      background: platformColors[platform.name] || '#0ECFB0',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Reports;