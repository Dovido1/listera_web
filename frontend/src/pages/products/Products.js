import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('tous');
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
  try {
    const response = await api.get('/api/products');
    console.log('Réponse produits:', response.data);
    const data = 
      response.data?.products || 
      response.data?.data || 
      response.data || 
      [];
    const list = Array.isArray(data) ? data : [data];
    setProducts(list);
  } catch (error) {
    console.error('Erreur chargement produits:', error);
  } finally {
    setLoading(false);
  }
};
    const handleDelete = async () => {
        try {
            await api.delete(`/api/products/${deleteModal}`);
            setProducts(products.filter((p) => p._id !== deleteModal));
            setDeleteModal(null);
        } catch (error) {
           console.error('Erreur suppression:', error);
        }
    };


  // Filtrage et recherche
  const filteredProducts = products.filter((p) => {
    const matchSearch = (p.title || p.name)?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'tous' ||
      (filter === 'stock' && p.quantity > 3) ||
      (filter === 'faible' && p.quantity > 0 && p.quantity <= 3) ||
      (filter === 'rupture' && p.quantity === 0);
    return matchSearch && matchFilter;
  });
  
  return (
    
    <div className="space-y-6">
        {deleteModal && (
  <div className="fixed inset-0 bg-black/50 z-50 
    flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
      <div className="w-12 h-12 rounded-full bg-red-50 flex 
        items-center justify-center mb-4">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
          stroke="#FF4D5B" strokeWidth="2">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2
            2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0
            00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </div>
      <h3 className="text-lg font-bold text-[#0A0F0E] mb-2">
        Supprimer le produit ?
      </h3>
      <p className="text-sm text-[#5A7270] mb-6">
        Cette action est irréversible. Le produit sera 
        définitivement supprimé.
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          className="flex-1 bg-[#FF4D5B] hover:bg-red-600
            text-white font-semibold py-2.5 rounded-xl text-sm
            transition-all duration-200"
        >
          Supprimer
        </button>
        <button
          onClick={() => setDeleteModal(null)}
          className="flex-1 border border-[#E2EEEC] text-[#5A7270]
            font-medium py-2.5 rounded-xl text-sm
            hover:border-[#0ECFB0] transition-all"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
)}

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="hidden lg:block">
  <h2 className="text-2xl font-bold text-[#0A0F0E]">Produits</h2>
  <p className="text-sm text-[#5A7270] mt-1">
    {products.length} produit{products.length > 1 ? 's' : ''} au total
  </p>
</div>
        <button
          onClick={() => navigate('/products/new')}
          className="flex items-center gap-2 bg-[#0ECFB0] hover:bg-[#09A88E]
            text-[#0A0F0E] font-semibold text-sm px-4 py-2.5 rounded-xl
            transition-all duration-200 hover:shadow-lg hover:shadow-[#0ECFB0]/25"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2.5">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          Nouveau produit
        </button>
      </div>

      {/* Filtres + Recherche */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Barre de recherche */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2"
            width="16" height="16" fill="none" viewBox="0 0 24 24"
            stroke="#94B0AE" strokeWidth="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2EEEC]
              bg-white text-[#0A0F0E] placeholder-[#94B0AE] text-sm
              focus:outline-none focus:border-[#0ECFB0]
              focus:ring-2 focus:ring-[#0ECFB0]/20 transition-all"
          />
        </div>

        {/* Filtres statut */}
        <div className="flex gap-2">
          {[
            { key: 'tous', label: 'Tous' },
            { key: 'stock', label: 'En stock' },
            { key: 'faible', label: 'Stock faible' },
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

      {/* Tableau */}
      <div className="bg-white border border-[#E2EEEC] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#0ECFB0]
              border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24"
              stroke="#E2EEEC" strokeWidth="1.5" className="mb-4">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <p className="text-[#5A7270] font-medium">Aucun produit trouvé</p>
            <p className="text-[#94B0AE] text-sm mt-1">
              Ajoutez votre premier produit
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F4F7F6] border-b border-[#E2EEEC]">
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider hidden md:table-cell">
                    Prix
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider hidden md:table-cell">
                    Stock
                  </th>
                  
                  <th className="text-left px-6 py-3 text-xs font-medium
                  text-[#94B0AE] uppercase tracking-wider hidden md:table-cell">
                    Canaux
                  </th>

                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium
                    text-[#94B0AE] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EEEC]">
                {filteredProducts.map((product) => (
                  <tr key={product._id}
                    className="hover:bg-[#F4F7F6] transition-colors">

                    {/* Nom + SKU + Image */}
<td className="px-6 py-4">
  <div className="flex items-center gap-3">
    {product.images && product.images.length > 0 ? (
      <img
        src={`http://localhost:5000/uploads/${product.images[0]}`}
        alt={product.title}
        className="w-10 h-10 rounded-lg object-cover 
          border border-[#E2EEEC] flex-shrink-0"
      />
    ) : (
      <div className="w-10 h-10 rounded-lg bg-[#F4F7F6] 
        border border-[#E2EEEC] flex items-center 
        justify-center flex-shrink-0">
        <svg width="16" height="16" fill="none" 
          viewBox="0 0 24 24" stroke="#94B0AE" strokeWidth="1.5">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 
            16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01
            M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 
            00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
    )}
    <div>
      <p className="text-sm font-medium text-[#0A0F0E]">
        {product.title || product.name}
      </p>
      <p className="text-xs text-[#94B0AE] mt-0.5">
        {product.sku || 'Sans SKU'}
      </p>
    </div>
  </div>
</td>

                    {/* Prix */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm font-medium text-[#0A0F0E]">
                        {product.price ? `$${product.price}` : '—'}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-[#0A0F0E]">
                        {product.quantity ?? '—'}
                      </span>
                    </td>
                    {/* Canaux / Marketplaces */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        {product.marketplace ? (
                        <span className="inline-flex items-center px-2 py-1
                          rounded-lg text-xs font-medium
                        bg-[#FFF3E0] text-[#E65C00]">
                          {product.marketplace}
                        </span>
                        ) : (
                      <span className="text-xs text-[#94B0AE]">
                    Non publié
                  </span>
                   )}
                  </div>
                  </td>
                    {/* Canaux */}
                    <th className="text-left px-6 py-3 text-xs font-medium
                   text-[#94B0AE] uppercase tracking-wider hidden md:table-cell">
                      Canaux
                    </th>

                    {/* Statut */}
                    <td className="px-6 py-4">
                      {product.quantity === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-1
                          rounded-full text-xs font-medium bg-red-50 text-red-600">
                          Rupture
                        </span>
                      ) : product.quantity <= 3 ? (
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

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">

                        {/* Éditer */}
                        <button
                          onClick={() => navigate(`/products/${product._id}`)}
                          className="p-1.5 rounded-lg hover:bg-[#E8FBF8]
                            text-[#94B0AE] hover:text-[#0ECFB0] transition-colors"
                          title="Modifier"
                        >
                          <svg width="15" height="15" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0
                              002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828
                              15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>

                        {/* Supprimer */}
                        <button
                          onClick={() => setDeleteModal(product._id)}
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

                      </div>
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

export default Products;