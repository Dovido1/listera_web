import { useState } from 'react';
import useAuthStore from '../../store/auth.store';
import api from '../../api/axios';

function Settings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profil');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      await api.put('/api/settings/profile', profileData);
      setSuccess('Profil mis à jour avec succès !');
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    try {
      await api.put('/api/settings/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Mot de passe mis à jour avec succès !');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError('Mot de passe actuel incorrect');
    }
  };

  const tabs = [
    { key: 'profil', label: 'Profil' },
    { key: 'securite', label: 'Sécurité' },
    { key: 'notifications', label: 'Notifications' },
  ];

  const inputClass = `w-full px-4 py-3 rounded-xl border border-[#E2EEEC]
    bg-white text-[#0A0F0E] placeholder-[#94B0AE] text-sm
    focus:outline-none focus:border-[#0ECFB0]
    focus:ring-2 focus:ring-[#0ECFB0]/20 transition-all`;

  return (
    <div className="space-y-6 max-w-2xl">

      {/* En-tête */}
      <div className="hidden lg:block">
  <h2 className="text-2xl font-bold text-[#0A0F0E]">Paramètres</h2>
  <p className="text-sm text-[#5A7270] mt-1">
    Gérez votre compte et vos préférences
  </p>
</div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F4F7F6] p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setSuccess(null);
              setError(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${activeTab === tab.key
                ? 'bg-white text-[#0A0F0E] shadow-sm'
                : 'text-[#5A7270] hover:text-[#0A0F0E]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600
          rounded-xl px-4 py-3 text-sm">
          ✓ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600
          rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Tab Profil */}
      {activeTab === 'profil' && (
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-6">
          <h3 className="font-bold text-[#0A0F0E] mb-6">
            Informations personnelles
          </h3>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6
            border-b border-[#E2EEEC]">
            <div className="w-16 h-16 rounded-full bg-[#0ECFB0] flex
              items-center justify-center text-[#0A0F0E]
              text-xl font-bold flex-shrink-0">
              {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
            </div>
            <div>
              <p className="font-medium text-[#0A0F0E]">{user?.name}</p>
              <p className="text-sm text-[#5A7270]">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({
                  ...profileData, name: e.target.value
                })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({
                  ...profileData, email: e.target.value
                })}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              className="bg-[#0ECFB0] hover:bg-[#09A88E] text-[#0A0F0E]
                font-semibold px-6 py-2.5 rounded-xl text-sm
                transition-all duration-200
                hover:shadow-lg hover:shadow-[#0ECFB0]/25"
            >
              Sauvegarder
            </button>
          </form>
        </div>
      )}

      {/* Tab Sécurité */}
      {activeTab === 'securite' && (
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-6">
          <h3 className="font-bold text-[#0A0F0E] mb-6">
            Changer le mot de passe
          </h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                Mot de passe actuel
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData, currentPassword: e.target.value
                })}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData, newPassword: e.target.value
                })}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A0F0E] mb-1.5">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData, confirmPassword: e.target.value
                })}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              className="bg-[#0ECFB0] hover:bg-[#09A88E] text-[#0A0F0E]
                font-semibold px-6 py-2.5 rounded-xl text-sm
                transition-all duration-200
                hover:shadow-lg hover:shadow-[#0ECFB0]/25"
            >
              Mettre à jour
            </button>
          </form>
        </div>
      )}

      {/* Tab Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white border border-[#E2EEEC] rounded-2xl p-6">
          <h3 className="font-bold text-[#0A0F0E] mb-6">
            Préférences de notifications
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Stock faible', desc: 'Alerte quand un produit passe sous 3 unités' },
              { label: 'Rupture de stock', desc: 'Alerte quand un produit est épuisé' },
              { label: 'Erreur de synchronisation', desc: 'Alerte en cas d\'échec de sync' },
              { label: 'Nouvelle vente', desc: 'Notification à chaque vente confirmée' },
            ].map((notif, index) => (
              <div key={index} className="flex items-center justify-between
                py-3 border-b border-[#E2EEEC] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#0A0F0E]">
                    {notif.label}
                  </p>
                  <p className="text-xs text-[#94B0AE] mt-0.5">
                    {notif.desc}
                  </p>
                </div>
                {/* Toggle */}
                <button
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    btn.classList.toggle('bg-[#0ECFB0]');
                    btn.classList.toggle('bg-[#E2EEEC]');
                    const dot = btn.querySelector('span');
                    dot.classList.toggle('translate-x-5');
                  }}
                  className="relative w-10 h-6 bg-[#0ECFB0] rounded-full
                    transition-colors duration-200 flex-shrink-0"
                >
                  <span className="absolute top-0.5 left-0.5 w-5 h-5
                    bg-white rounded-full shadow transition-transform
                    duration-200 translate-x-0"/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default Settings;