import { useState, useEffect } from 'react';
import api from '../../api/axios';

const MARKETPLACES_CONFIG = [
  {
    id: 'ebay',
    name: 'eBay',
    description: 'La plus grande marketplace mondiale',
    color: '#E65C00',
    bg: '#FFF3E0',
    api: true,
  },
  {
    id: 'etsy',
    name: 'Etsy',
    description: 'Idéal pour les produits faits main et vintage',
    color: '#F45800',
    bg: '#FFF0F3',
    api: true,
  },
  {
    id: 'mercari',
    name: 'Mercari',
    description: 'Plateforme de revente populaire aux USA',
    color: '#0ECFB0',
    bg: '#E8FBF8',
    api: true,
  },
  {
    id: 'poshmark',
    name: 'Poshmark',
    description: 'Spécialisée dans la mode et les vêtements',
    color: '#CC0099',
    bg: '#FFF0FB',
    api: false,
  },
  {
    id: 'facebook',
    name: 'Facebook Marketplace',
    description: 'Vendez localement et nationalement',
    color: '#1877F2',
    bg: '#EEF2FF',
    api: false,
  },
];

function Marketplaces() {
  const [marketplaces, setMarketplaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketplaces();
  }, []);

  const fetchMarketplaces = async () => {
    try {
      const response = await api.get('/api/marketplaces');
      const data = response.data?.marketplaces || response.data || [];
      setMarketplaces(data);
    } catch (error) {
      console.error('Erreur chargement marketplaces:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vérifie si une marketplace est connectée
  const isConnected = (id) => {
    return marketplaces.some((m) => m.platform === id && m.connected);
  };

  const handleConnect = (id) => {
    alert(`Connexion à ${id} — intégration API à configurer`);
  };

  const handleDisconnect = async (id) => {
    if (!window.confirm('Déconnecter cette plateforme ?')) return;
    try {
      await api.put(`/api/marketplaces/${id}`, { connected: false });
      setMarketplaces(marketplaces.map((m) =>
        m.platform === id ? { ...m, connected: false } : m
      ));
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="hidden lg:block">
  <h2 className="text-2xl font-bold text-[#0A0F0E]">Marketplaces</h2>
  <p className="text-sm text-[#5A7270] mt-1">
    Connectez et gérez vos plateformes de vente
  </p>
</div>

      {/* Résumé */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-4">
          <p className="text-xs text-[#5A7270] mb-1">Plateformes disponibles</p>
          <p className="text-2xl font-bold text-[#0A0F0E]">
            {MARKETPLACES_CONFIG.length}
          </p>
        </div>
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-4">
          <p className="text-xs text-[#5A7270] mb-1">Connectées</p>
          <p className="text-2xl font-bold text-[#22C55E]">
            {marketplaces.filter((m) => m.connected).length}
          </p>
        </div>
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-4
          col-span-2 lg:col-span-1">
          <p className="text-xs text-[#5A7270] mb-1">Avec API officielle</p>
          <p className="text-2xl font-bold text-[#0ECFB0]">
            {MARKETPLACES_CONFIG.filter((m) => m.api).length}
          </p>
        </div>
      </div>

      {/* Liste marketplaces */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#0ECFB0]
            border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MARKETPLACES_CONFIG.map((mp) => {
            const connected = isConnected(mp.id);
            return (
              <div key={mp.id}
                className="bg-white border border-[#E2EEEC] rounded-2xl p-6
                  hover:border-[#0ECFB0]/30 hover:shadow-sm transition-all">

                {/* Header card */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div className="w-12 h-12 rounded-xl flex items-center
                      justify-center font-bold text-sm"
                      style={{ background: mp.bg, color: mp.color }}>
                      {mp.name.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0A0F0E]">
                        {mp.name}
                      </h3>
                      <p className="text-xs text-[#94B0AE]">
                        {mp.description}
                      </p>
                    </div>
                  </div>

                  {/* Statut connexion */}
                  <div className={`flex items-center gap-1.5 px-3 py-1
                    rounded-full text-xs font-medium
                    ${connected
                      ? 'bg-green-50 text-green-600'
                      : 'bg-[#F4F7F6] text-[#94B0AE]'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full
                      ${connected ? 'bg-[#22C55E]' : 'bg-[#94B0AE]'}`}/>
                    {connected ? 'Connecté' : 'Non connecté'}
                  </div>
                </div>

                {/* Badge API */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                    ${mp.api
                      ? 'bg-[#E8FBF8] text-[#09A88E]'
                      : 'bg-[#FFF7ED] text-[#EA580C]'
                    }`}>
                    {mp.api ? '✓ API officielle' : '⚡ Web scraping'}
                  </span>
                </div>

                {/* Bouton action */}
                {connected ? (
                  <button
                    onClick={() => handleDisconnect(mp.id)}
                    className="w-full py-2.5 rounded-xl border border-[#E2EEEC]
                      text-sm text-[#5A7270] font-medium
                      hover:border-red-300 hover:text-red-500
                      transition-all duration-200"
                  >
                    Déconnecter
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(mp.id)}
                    className="w-full py-2.5 rounded-xl bg-[#0ECFB0]
                      hover:bg-[#09A88E] text-[#0A0F0E] text-sm font-semibold
                      transition-all duration-200
                      hover:shadow-lg hover:shadow-[#0ECFB0]/25"
                  >
                    Connecter
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default Marketplaces;
          