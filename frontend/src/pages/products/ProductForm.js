import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const PLATFORMS = ['eBay', 'Etsy', 'Mercari', 'Poshmark', 'Facebook'];

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
const [imageUploading, setImageUploading] = useState(false);


  const [formData, setFormData] = useState({
    title: '',
    sku: `LST-${Date.now().toString().slice(-6)}`,
    description: '',
    price: '',
    quantity: '',
    category: '',
    marketplace: [],
    condition: 'new',
  });

  useEffect(() => {
    if (isEditing) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/products/${id}`);
      const product = response.data?.product || response.data;
      setFormData({
        title: product.title || '',
        sku: product.sku || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        category: product.category || '',
        marketplace: product.marketplaces || [],
        condition: product.condition || 'new',
      });
    } catch (error) {
      console.error('Erreur chargement produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Aperçu local immédiat
  const reader = new FileReader();
  reader.onload = (e) => setImagePreview(e.target.result);
  reader.readAsDataURL(file);

  // Upload vers le backend
  setImageUploading(true);
  try {
    const formDataImg = new FormData();
    formDataImg.append('image', file);
    formDataImg.append('action', 'resize');
    formDataImg.append('width', '800');
    formDataImg.append('height', '800');

    const response = await api.post('/api/upload', formDataImg, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setFormData((prev) => ({
      ...prev,
      images: [response.data.path],
    }));
  } catch (error) {
    console.error('Erreur upload image:', error);
  } finally {
    setImageUploading(false);
  }
};

const handleAiOptimize = async () => {
  if (!formData.title) {
    setError('Entrez d\'abord le nom du produit');
    return;
  }
  setAiLoading(true);
  try {
    // Simulation optimisation IA
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const descriptions = [
      `${formData.title} — Article de qualité supérieure, parfait pour les amateurs exigeants. État impeccable, livraison rapide et soignée. Satisfait ou remboursé.`,
      `Découvrez ce ${formData.title} en excellent état. Photos authentiques, description honnête. Expédition sous 24h après paiement. N'hésitez pas à poser vos questions.`,
      `${formData.title} disponible immédiatement. Produit vérifié et testé. Emballage sécurisé pour la livraison. Vendeur sérieux avec nombreux avis positifs.`,
    ];

    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    setFormData((prev) => ({
      ...prev,
      description: randomDesc,
    }));
  } catch (error) {
    setError('Erreur lors de l\'optimisation IA');
  } finally {
    setAiLoading(false);
  }
};

const handlePublish = async () => {
  if (!formData.title || !formData.price) {
    setError('Nom et prix obligatoires pour publier');
    return;
  }
  if (!formData.marketplace) {
    setError('Sélectionnez une plateforme pour publier');
    return;
  }

  setPublishing(true);
  setError(null);
  try {
    // Sauvegarde d'abord
    let productId = id;
    if (!isEditing) {
      const response = await api.post('/api/products', formData);
      productId = response.data._id;
    } else {
      await api.put(`/api/products/${id}`, formData);
    }

    // Simulation publication sur marketplace
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setPublishSuccess(
      `✓ Produit publié avec succès sur ${formData.marketplace} !`
    );

    setTimeout(() => navigate('/products'), 2000);
  } catch (err) {
    setError('Erreur lors de la publication');
  } finally {
    setPublishing(false);
  }
};

  const toggleMarketplace = (platform) => {
    setFormData((prev) => ({
      ...prev,
      marketplace: prev.marketplace.includes(platform)
        ? prev.marketplace.filter((p) => p !== platform)
        : [...prev.marketplace, platform],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Le nom du produit est obligatoire');
      return;
    }

    setSubmitting(true);
    try {
      console.log('FormData envoyé:', formData);
      if (isEditing) {
        await api.put(`/api/products/${id}`, formData);
      } else {
        await api.post('/api/products', formData);
      }
      navigate('/products');
    } catch (err) {
      setError('Erreur lors de la sauvegarde du produit');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border border-[#E2EEEC]
    bg-white text-[#0A0F0E] placeholder-[#94B0AE] text-sm
    focus:outline-none focus:border-[#0ECFB0]
    focus:ring-2 focus:ring-[#0ECFB0]/20 transition-all`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#0ECFB0]
          border-t-transparent rounded-full animate-spin"/>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">

      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 rounded-xl border border-[#E2EEEC]
            hover:border-[#0ECFB0] transition-colors"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
            stroke="#5A7270" strokeWidth="2">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[#0A0F0E]">
            {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <p className="text-sm text-[#5A7270] mt-1">
            {isEditing
              ? 'Modifiez les informations du produit'
              : 'Ajoutez un nouveau produit à votre inventaire'
            }
          </p>
        </div>
      </div>

      {/* Message erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600
          rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Infos principales */}
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-6">
          <h3 className="font-bold text-[#0A0F0E] mb-5">
            Informations principales
          </h3>
          <div className="space-y-4">
           {/* Image produit */}
<div className="bg-white border border-[#E2EEEC] rounded-2xl p-6">
  <h3 className="font-bold text-[#0A0F0E] mb-2">
    Image du produit
  </h3>
  <p className="text-xs text-[#5A7270] mb-4">
    Format recommandé : JPG, PNG — max 5MB
  </p>

  {/* Zone upload */}
  <label className="block cursor-pointer">
    <div className={`border-2 border-dashed rounded-xl p-6
      flex flex-col items-center justify-center text-center
      transition-all duration-200
      ${imagePreview
        ? 'border-[#0ECFB0]'
        : 'border-[#E2EEEC] hover:border-[#0ECFB0]'
      }`}>

      {imageUploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-[#0ECFB0]
            border-t-transparent rounded-full animate-spin"/>
          <p className="text-sm text-[#5A7270]">Upload en cours...</p>
        </div>
      ) : imagePreview ? (
        <div className="w-full">
          <img
            src={imagePreview}
            alt="Aperçu"
            className="w-full max-h-48 object-contain rounded-lg mb-3"
          />
          <p className="text-xs text-[#0ECFB0] font-medium">
            image téléchargée — cliquer pour changer
          </p>
        </div>
      ) : (
        <>
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24"
            stroke="#94B0AE" strokeWidth="1.5" className="mb-3">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2
              2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0
              00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p className="text-sm font-medium text-[#5A7270] mb-1">
            Cliquer pour ajouter une image
          </p>
          <p className="text-xs text-[#94B0AE]">
            JPG, PNG jusqu'à 5MB
          </p>
        </>
      )}
    </div>
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />
  </label>
</div> 

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                Nom du produit <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Nike Air Max 90"
                required
                className={inputClass}
              />
            </div>

            {/* SKU + Catégorie */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Ex: SKU-0042"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                  Catégorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Sélectionner...</option>
                  <option value="mode">Mode & Vêtements</option>
                  <option value="electronique">Électronique</option>
                  <option value="maison">Maison & Jardin</option>
                  <option value="sport">Sport & Loisirs</option>
                  <option value="collection">Collection & Art</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-[#0A0F0E]">
                    Description
                  </label>
                  <button
                    type="button"
                    onClick={handleAiOptimize}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 text-xs font-medium
                  text-[#0ECFB0] hover:text-[#09A88E] transition-colors
                    disabled:opacity-60"
                  >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth="2">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  {aiLoading ? 'Optimisation...' : '✨ Optimiser par IA'}
                  </button>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre produit en détail..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>
          </div>
        </div>

        {/* Prix et stock */}
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-6">
          <h3 className="font-bold text-[#0A0F0E] mb-5">
            Prix et stock
          </h3>
          <div className="grid grid-cols-2 gap-4">

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                Prix ($) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className={inputClass}
              />
            </div>

            {/* Quantité */}
            <div>
              <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                Quantité <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
                className={inputClass}
              />
            </div>

            {/* État */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                État du produit
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'new', label: 'Neuf' },
                  { value: 'like_new', label: 'Comme neuf' },
                  { value: 'good', label: 'Bon état' },
                  { value: 'fair', label: 'État correct' },
                ].map((cond) => (
                  <button
                    key={cond.value}
                    type="button"
                    onClick={() => setFormData({
                      ...formData, condition: cond.value
                    })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium
                      border transition-all duration-200
                      ${formData.condition === cond.value
                        ? 'bg-[#0ECFB0] border-[#0ECFB0] text-[#0A0F0E]'
                        : 'bg-white border-[#E2EEEC] text-[#5A7270] hover:border-[#0ECFB0]'
                      }`}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Plateformes */}
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-6">
            <h3 className="font-bold text-[#0A0F0E] mb-2">
                Plateforme de vente
            </h3>
            <p className="text-xs text-[#5A7270] mb-4">
                Sélectionnez la marketplace principale
            </p>
            <select
                name="marketplace"
                value={formData.marketplace}
                onChange={handleChange}
                className={inputClass}
        >
                <option value="">Sélectionner la plateforme...</option>
                {PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
               ))}
            </select>
        </div>
        
        {/* Messages succès publication */}
{publishSuccess && (
  <div className="bg-green-50 border border-green-200 text-green-600
    rounded-xl px-4 py-3 text-sm font-medium">
    {publishSuccess}
  </div>
)}

{/* Boutons */}
<div className="flex gap-3">
  {/* Sauvegarder */}
  <button
    type="submit"
    disabled={submitting}
    className="flex-1 bg-white hover:bg-[#F4F7F6] border border-[#E2EEEC]
      hover:border-[#0ECFB0] text-[#0A0F0E] font-semibold py-3 
      rounded-xl text-sm transition-all duration-200
      disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {submitting ? 'Sauvegarde...' : ' Sauvegarder'}
  </button>

  {/* Publier */}
  <button
    type="button"
    onClick={handlePublish}
    disabled={publishing}
    className="flex-1 bg-[#0ECFB0] hover:bg-[#09A88E]
      text-[#0A0F0E] font-semibold py-3 rounded-xl text-sm
      transition-all duration-200
      hover:shadow-lg hover:shadow-[#0ECFB0]/25
      disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {publishing ? (
      <span className="flex items-center justify-center gap-2">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth="2"
          className="animate-spin">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 
            9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 
            01-15.357-2m15.357 2H15"/>
        </svg>
        Publication en cours...
      </span>
    ) : ' Publier sur la marketplace'}
  </button>

  {/* Annuler */}
  <button
    type="button"
    onClick={() => navigate('/products')}
    className="px-6 py-3 rounded-xl border border-[#E2EEEC]
      text-sm text-[#5A7270] font-medium
      hover:border-[#0ECFB0] transition-all"
  >
    Annuler
  </button>
</div>
        

      </form>
    </div>
  );
}

export default ProductForm;