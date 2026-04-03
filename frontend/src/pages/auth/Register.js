import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';

function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [localError, setLocalError] = useState(null);

  // Mise à jour des champs
  const handleChange = (e) => {
    clearError();
    setLocalError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification mots de passe
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const result = await register(
      formData.name,
      formData.email,
      formData.password
    );

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div>
      {/* Titre */}
      <h2 className="text-3xl font-bold text-[#0A0F0E] mb-2">
        Créer un compte 🚀
      </h2>
      <p className="text-[#5A7270] mb-8">
        Rejoignez Listera et gérez vos marketplaces
      </p>

      {/* Message d'erreur */}
      {(error || localError) && (
        <div className="bg-red-50 border border-red-200 text-red-600 
          rounded-xl px-4 py-3 mb-6 text-sm">
          {error || localError}
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
            Nom complet
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Arielle Dupont"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#E2EEEC] 
              bg-white text-[#0A0F0E] placeholder-[#94B0AE]
              focus:outline-none focus:border-[#0ECFB0] 
              focus:ring-2 focus:ring-[#0ECFB0]/20
              transition-all duration-200"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
            Adresse email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="vous@exemple.com"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#E2EEEC] 
              bg-white text-[#0A0F0E] placeholder-[#94B0AE]
              focus:outline-none focus:border-[#0ECFB0] 
              focus:ring-2 focus:ring-[#0ECFB0]/20
              transition-all duration-200"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
            Mot de passe
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#E2EEEC] 
              bg-white text-[#0A0F0E] placeholder-[#94B0AE]
              focus:outline-none focus:border-[#0ECFB0] 
              focus:ring-2 focus:ring-[#0ECFB0]/20
              transition-all duration-200"
          />
        </div>

        {/* Confirmer mot de passe */}
        <div>
          <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#E2EEEC] 
              bg-white text-[#0A0F0E] placeholder-[#94B0AE]
              focus:outline-none focus:border-[#0ECFB0] 
              focus:ring-2 focus:ring-[#0ECFB0]/20
              transition-all duration-200"
          />
        </div>

        {/* Bouton inscription */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#0ECFB0] hover:bg-[#09A88E] 
            text-[#0A0F0E] font-semibold py-3 rounded-xl
            transition-all duration-200 
            hover:shadow-lg hover:shadow-[#0ECFB0]/25
            disabled:opacity-60 disabled:cursor-not-allowed
            mt-2"
        >
          {isLoading ? 'Création...' : 'Créer mon compte'}
        </button>

      </form>

      {/* Lien login */}
      <p className="text-center text-sm text-[#5A7270] mt-6">
        Déjà un compte ?{' '}
        <Link
          to="/login"
          className="text-[#0ECFB0] font-medium hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}

export default Register;