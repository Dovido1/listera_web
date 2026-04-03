import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';

const navigation = [
  {
    section: 'Menu principal',
    items: [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 
              1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 
              001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        ),
      },
      {
        name: 'Produits',
        path: '/products',
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 
              7m8 4v10M4 7v10l8 4"/>
          </svg>
        ),
      },
      {
        name: 'Inventaire',
        path: '/inventory',
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 
              002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 
              002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        ),
      },
      {
        name: 'Annonces',
        path: '/listings',
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 
              002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 
              15H9v-2.828l8.586-8.586z"/>
          </svg>
        ),
      },
      {
        name: 'Marketplaces',
        path: '/marketplaces',
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Analyse',
    items: [
      {
        name: 'Rapports',
        path: '/reports',
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 
              002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 
              2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 
              012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        ),
      },
      {
        name: 'Paramètres',
        path: '/settings',
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 
              0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 
              2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 
              1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 
              2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 
              00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 
              0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826
              -2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756
              -.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066
              -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 
              2.296.07 2.572-1.065z"/>
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        ),
      },
    ],
  },
];

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Initiales de l'utilisateur pour l'avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-60 bg-[#0A0F0E] z-50
        flex flex-col py-6 px-4
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
          <path d="M18 2 L32 10 L32 26 L18 34 L4 26 L4 10 Z"
            fill="none" stroke="#0ECFB0" strokeWidth="1.2" opacity="0.4"/>
          <path d="M18 7 L28 13 L28 25 L18 31 L8 25 L8 13 Z"
            fill="rgba(14,207,176,0.07)" stroke="#0ECFB0"
            strokeWidth="0.8" opacity="0.7"/>
          <path d="M13 11 L13 25 L24 25"
            stroke="#0ECFB0" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="24" cy="18" r="2" fill="#0ECFB0"/>
        </svg>
        <span className="text-white font-bold text-xl tracking-tight">
          Listera
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto">
        {navigation.map((group) => (
          <div key={group.section}>
            <p className="text-[#3A5250] text-xs font-medium 
              uppercase tracking-widest px-3 mb-2">
              {group.section}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl
                      text-sm transition-all duration-200
                      ${isActive
                        ? 'bg-[#0ECFB0]/12 text-[#0ECFB0] font-medium'
                        : 'text-[#7A9E9B] hover:bg-[#1C2423] hover:text-white'
                      }`
                    }
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-[#1C2423] pt-4 mt-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl
          hover:bg-[#1C2423] transition-colors cursor-pointer group">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#0ECFB0] flex 
            items-center justify-center text-[#0A0F0E] 
            text-xs font-bold flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          {/* Infos */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.name || 'Utilisateur'}
            </p>
            <p className="text-[#3A5250] text-xs truncate">
              {user?.email || ''}
            </p>
          </div>
          {/* Bouton logout */}
          <button
            onClick={handleLogout}
            className="text-[#3A5250] hover:text-[#FF4D5B] 
              transition-colors flex-shrink-0"
            title="Se déconnecter"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth="2">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 
                01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;