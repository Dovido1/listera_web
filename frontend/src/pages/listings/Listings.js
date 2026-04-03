import { useState, useEffect } from 'react';
import api from '../../api/axios';

const PLATFORMS = ['eBay', 'Etsy', 'Mercari', 'Poshmark', 'Facebook'];

function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('tous');
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    platforms: [],
    price: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListings();
    fetchProducts();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await api.get('/api/listings');
      const data = response.data?.listings || response.data || [];
      setListings(data);
    } catch (error) {
      console.error('Erreur chargement annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      const data = response.data?.products || response.data || [];
      setProducts(data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    }
  };

  const togglePlatform = (platform) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.platforms.length === 0) {
      setError('Sélectionnez au moins une plateforme');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/listings', formData);
      setSuccess('Annonce publiée avec succès !');
      setFormData({ productId: '', platforms: [], price: '', description: '' });
      setShowForm(false);
      fetchListings();
    } catch (err) {
      setError('Erreur lors de la publication');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette annonce ?')) return;
    try {
      await api.delete(`/api/listings/${id}`);
      setListings(listings.filter((l) => l._id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  // Filtrage
  const filteredListings = listings.filter((l) => {
    const matchSearch = l.productName?.toLowerCase().includes(search.toLowerCase()) ||
      l.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'tous' ||
      (filter === 'actif' && l.status === 'active') ||
      (filter === 'attente' && l.status === 'pending') ||
      (filter === 'erreur' && l.status === 'error');
    return matchSearch && matchFilter;
  });

  const inputClass = `w-full px-4 py-3 rounded-xl border border-[#E2EEEC]
    bg-white text-[#0A0F0E] placeholder-[#94B0AE] text-sm
    focus:outline-none focus:border-[#0ECFB0]
    focus:ring-2 focus:ring-[#0ECFB0]/20 transition-all`;

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="hidden lg:block">
  <h2 className="text-2xl font-bold text-[#0A0F0E]">Annonces</h2>
  <p className="text-sm text-[#5A7270] mt-1">
    Publiez et gérez vos annonces sur toutes les plateformes
  </p>
</div>
        <button
  onClick={() => {
    setShowForm(!showForm);
    setSuccess(null);
    setError(null);
  }}
  className="flex items-center gap-2 bg-[#0ECFB0] hover:bg-[#09A88E]
    text-[#0A0F0E] font-semibold text-sm px-4 py-2.5 rounded-xl
    transition-all duration-200 hover:shadow-lg hover:shadow-[#0ECFB0]/25"
>
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth="2.5">
    <path d="M12 4v16m8-8H4"/>
  </svg>
  {showForm ? 'Fermer' : 'Créer une annonce'}
</button>
      </div>

      {/* Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600
          rounded-xl px-4 py-3 text-sm">
          ✓ {success}
        </div>
      )}

      {/* Formulaire nouvelle annonce */}
      {showForm && (
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-6">
          <h3 className="font-bold text-[#0A0F0E] mb-6">
            Publier une nouvelle annonce
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600
              rounded-xl px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Sélection produit */}
            <div>
              <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                Produit
              </label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                required
                className={inputClass}
              >
                <option value="">Sélectionner un produit...</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} {p.sku ? `(${p.sku})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélection plateformes */}
            <div>
              <label className="block text-sm font-medium text-[#0A0F0E] mb-2">
                Plateformes de publication
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium
                      border transition-all duration-200
                      ${formData.platforms.includes(platform)
                        ? 'bg-[#0ECFB0] border-[#0ECFB0] text-[#0A0F0E]'
                        : 'bg-white border-[#E2EEEC] text-[#5A7270] hover:border-[#0ECFB0]'
                      }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                Prix ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez votre produit..."
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#0ECFB0] hover:bg-[#09A88E]
                  text-[#0A0F0E] font-semibold py-3 rounded-xl text-sm
                  transition-all duration-200
                  hover:shadow-lg hover:shadow-[#0ECFB0]/25
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Publication...' : 'Publier sur les plateformes'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl border border-[#E2EEEC]
                  text-sm text-[#5A7270] font-medium
                  hover:border-[#0ECFB0] transition-all"
              >
                Annuler
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Filtres + Recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2"
            width="16" height="16" fill="none" viewBox="0 0 24 24"
            stroke="#94B0AE" strokeWidth="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher une annonce..."
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
            { key: 'tous', label: 'Toutes' },
            { key: 'actif', label: 'Actives' },
            { key: 'attente', label: 'En attente' },
            { key: 'erreur', label: 'Erreur' },
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

      {/* Tableau annonces */}
      <div className="bg-white border border-[#E2EEEC] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#0ECFB0]
              border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24"
              stroke="#E2EEEC" strokeWidth="1.5" className="mb-4">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0
                002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828
                15H9v-2.828l8.586-8.586z"/>
            </svg>
            <p className="text-[#5A7270] font-medium">Aucune annonce trouvée</p>
            <p className="text-[#94B0AE] text-sm mt-1">
              Créez votre première annonce
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F4F7F6] border-b border-[#E2EEEC]">
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider">Produit</th>
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider hidden md:table-cell">
                    Plateformes</th>
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider hidden md:table-cell">
                    Prix</th>
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider">Statut</th>
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EEEC]">
                {filteredListings.map((listing) => (
                  <tr key={listing._id}
                    className="hover:bg-[#F4F7F6] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#0A0F0E]">
                        {listing.productName || listing.title || 'Annonce'}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1
                        rounded-full text-xs font-medium
                        bg-[#E8FBF8] text-[#09A88E]">
                        {listing.platforms?.join(' · ') || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#0A0F0E]
                      hidden md:table-cell">
                      {listing.price ? `$${listing.price}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {listing.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-1
                          rounded-full text-xs font-medium bg-green-50 text-green-600">
                          Actif
                        </span>
                      ) : listing.status === 'error' ? (
                        <span className="inline-flex items-center px-2.5 py-1
                          rounded-full text-xs font-medium bg-red-50 text-red-600">
                          Erreur
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1
                          rounded-full text-xs font-medium bg-orange-50 text-orange-600">
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50
                          text-[#94B0AE] hover:text-red-500 transition-colors"
                        title="Supprimer"
                      >
                        <svg width="15" height="15" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2
                            2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0
                            00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
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

export default Listings;