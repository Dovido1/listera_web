import { useLocation } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';

// Titre de chaque page selon l'URL
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/products': 'Produits',
  '/inventory': 'Inventaire',
  '/listings': 'Annonces',
  '/marketplaces': 'Marketplaces',
  '/reports': 'Rapports',
  '/settings': 'Paramètres',
};

function Topbar({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuthStore();

  const pageTitle = pageTitles[location.pathname] || 'Listera';

  return (
    <header className="bg-white border-b border-[#E2EEEC] 
      px-6 h-16 flex items-center justify-between
      sticky top-0 z-30">

      {/* Gauche — hamburger + titre */}
      <div className="flex items-center gap-4">

        {/* Bouton menu mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-[#F4F7F6] 
            transition-colors"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"
            stroke="#0A0F0E" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        {/* Titre visible seulement sur mobile */}
        <h1 className="text-lg font-bold text-[#0A0F0E] lg:hidden">
          {pageTitle}
        </h1>
      </div>

      {/* Droite — notification + bouton + avatar */}
      <div className="flex items-center gap-3">

        {/* Bouton notification */}
        <button className="relative p-2 rounded-xl border border-[#E2EEEC]
          hover:border-[#0ECFB0] transition-colors">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
            stroke="#5A7270" strokeWidth="2">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 
              14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 
              0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 
              1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          {/* Point rouge notification */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 
            bg-[#FF4D5B] rounded-full border-2 border-white"/>
        </button>

        {/* Bouton nouvelle annonce — caché sur mobile */}
        <button className="hidden sm:flex items-center gap-2 
          bg-[#0ECFB0] hover:bg-[#09A88E] text-[#0A0F0E] 
          font-semibold text-sm px-4 py-2.5 rounded-xl
          transition-all duration-200
          hover:shadow-lg hover:shadow-[#0ECFB0]/25">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2.5">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          Nouvelle annonce
        </button>

        {/* Avatar utilisateur */}
        <div className="w-9 h-9 rounded-full bg-[#0ECFB0] flex 
          items-center justify-center text-[#0A0F0E] 
          text-xs font-bold cursor-pointer flex-shrink-0">
          {user?.name
            ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
            : 'U'}
        </div>

      </div>
    </header>
  );
}

export default Topbar;