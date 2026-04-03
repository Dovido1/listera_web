import { useState, useEffect } from 'react';
import api from '../../api/axios';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('tous');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
  try {
    // On utilise les produits comme source d'inventaire
    const response = await api.get('/api/products');
    const data = response.data?.products || response.data || [];
    setInventory(data);
  } catch (error) {
    console.error('Erreur chargement inventaire:', error);
  } finally {
    setLoading(false);
  }
};

const handleSync = async () => {
  setSyncing(true);
  setSyncMessage(null);
  try {
    // Simulation synchronisation marketplace
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSyncMessage(`✓ ${inventory.length} produits synchronisés sur toutes les plateformes`);
    fetchInventory();
  } catch (error) {
    setSyncMessage('Erreur lors de la synchronisation');
  } finally {
    setSyncing(false);
  }
};

  const updateQuantity = async (id, newQuantity) => {
  if (newQuantity < 0) return;
  try {
    await api.put(`/api/products/${id}`, { quantity: newQuantity });
    setInventory(inventory.map((item) =>
      item._id === id ? { ...item, quantity: newQuantity } : item
    ));
  } catch (error) {
    console.error('Erreur mise à jour:', error);
  }
};

  // Filtrage
  const filteredInventory = inventory.filter((item) => {
    const matchSearch = (item.title || item.name)?.toLowerCase().includes(search.toLowerCase()) ||
    item.sku?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'tous' ||
      (filter === 'stock' && item.quantity > 3) ||
      (filter === 'faible' && item.quantity > 0 && item.quantity <= 3) ||
      (filter === 'rupture' && item.quantity === 0);
    return matchSearch && matchFilter;
  });

  // Compteurs résumé
  const totalItems = inventory.length;
  const lowStock = inventory.filter((i) => i.quantity > 0 && i.quantity <= 3).length;
  const outOfStock = inventory.filter((i) => i.quantity === 0).length;
  const inStock = inventory.filter((i) => i.quantity > 3).length;

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between">
  <div className="hidden lg:block">
    <h2 className="text-2xl font-bold text-[#0A0F0E]">Inventaire</h2>
    <p className="text-sm text-[#5A7270] mt-1">
      Gérez vos niveaux de stock en temps réel
    </p>
  </div>
  {syncMessage && (
  <div className="bg-green-50 border border-green-200 text-green-600
    rounded-xl px-4 py-3 text-sm">
    {syncMessage}
  </div>
)}

  {/* Bouton Synchroniser tout */}
  <button
    onClick={handleSync}
    disabled={syncing}
    className="flex items-center gap-2 bg-[#0A0F0E] hover:bg-[#1C2423]
      text-white font-semibold text-sm px-4 py-2.5 rounded-xl
      transition-all duration-200 disabled:opacity-60"
  >
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth="2"
      className={syncing ? 'animate-spin' : ''}>
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 
        0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 
        2H15"/>
    </svg>
    {syncing ? 'Synchronisation...' : 'Synchroniser tout'}
  </button>
</div>

      {/* Résumé stock */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-4">
          <p className="text-xs text-[#5A7270] mb-1">Total articles</p>
          <p className="text-2xl font-bold text-[#0A0F0E]">{totalItems}</p>
        </div>
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-4">
          <p className="text-xs text-[#5A7270] mb-1">En stock</p>
          <p className="text-2xl font-bold text-[#22C55E]">{inStock}</p>
        </div>
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-4">
          <p className="text-xs text-[#5A7270] mb-1">Stock faible</p>
          <p className="text-2xl font-bold text-[#FB923C]">{lowStock}</p>
        </div>
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-4">
          <p className="text-xs text-[#5A7270] mb-1">Rupture</p>
          <p className="text-2xl font-bold text-[#FF4D5B]">{outOfStock}</p>
        </div>
      </div>

      {/* Recherche + filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2"
            width="16" height="16" fill="none" viewBox="0 0 24 24"
            stroke="#94B0AE" strokeWidth="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2EEEC]
              bg-white text-[#0A0F0E] placeholder-[#94B0AE] text-sm
              focus:outline-none focus:border-[#0ECFB0]
              focus:ring-2 focus:ring-[#0ECFB0]/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'tous', label: 'Tous' },
            { key: 'stock', label: 'En stock' },
            { key: 'faible', label: 'Faible' },
            { key: 'rupture', label: 'Rupture' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-2 rounded-xl text-sm font-medium
                transition-all duration-200 whitespace-nowrap
                ${filter === f.key
                  ? 'bg-[#0ECFB0] text-[#0A0F0E]'
                  : 'bg-white border border-[#E2EEEC] text-[#5A7270] hover:border-[#0ECFB0]'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau inventaire */}
      <div className="bg-white border border-[#E2EEEC] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#0ECFB0]
              border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24"
              stroke="#E2EEEC" strokeWidth="1.5" className="mb-4">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0
                002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0
                002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p className="text-[#5A7270] font-medium">Aucun article trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F4F7F6] border-b border-[#E2EEEC]">
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider">Article</th>
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider hidden md:table-cell">
                    SKU</th>
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider">Quantité</th>
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EEEC]">
                {filteredInventory.map((item) => (
                  <tr key={item._id}
                    className="hover:bg-[#F4F7F6] transition-colors">

                    {/* Nom */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#0A0F0E]">
                        {item.title || item.name || 'Article'}
                      </p>
                    </td>

                    {/* SKU */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-xs text-[#94B0AE]">
                        {item.sku || '—'}
                      </span>
                    </td>

                    {/* Quantité avec contrôles */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg border border-[#E2EEEC]
                            flex items-center justify-center text-[#5A7270]
                            hover:border-[#0ECFB0] hover:text-[#0ECFB0]
                            transition-colors text-sm font-medium"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-medium
                          text-[#0A0F0E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg border border-[#E2EEEC]
                            flex items-center justify-center text-[#5A7270]
                            hover:border-[#0ECFB0] hover:text-[#0ECFB0]
                            transition-colors text-sm font-medium"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4">
                      {item.quantity === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-1
                          rounded-full text-xs font-medium bg-red-50 text-red-600">
                          Rupture
                        </span>
                      ) : item.quantity <= 3 ? (
                        <span className="inline-flex items-center px-2.5 py-1
                          rounded-full text-xs font-medium bg-orange-50 text-orange-600">
                          Stock faible
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1
                          rounded-full text-xs font-medium bg-green-50 text-green-600">
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

    </div>
  );
}

export default Inventory;