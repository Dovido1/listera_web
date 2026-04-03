import { NavLink } from 'react-router-dom';

const navItems = [
  {
    name: 'Home',
    path: '/dashboard',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
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
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth="2">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 
          7m8 4v10M4 7v10l8 4"/>
      </svg>
    ),
  },
  {
    name: 'Annonces',
    path: '/listings',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth="2">
        <path d="M12 4v16m8-8H4"/>
      </svg>
    ),
    special: true,
  },
  {
    name: 'Rapports',
    path: '/reports',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
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
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
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
];

function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 
      bg-[#0A0F0E] border-t border-[#1C2423] z-30
      flex items-center justify-around px-2 pb-4 pt-2">

      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1.5 
            rounded-xl transition-all duration-200
            ${item.special
              ? 'bg-[#0ECFB0] text-[#0A0F0E] -mt-6 p-3 rounded-2xl shadow-lg shadow-[#0ECFB0]/30'
              : isActive
                ? 'text-[#0ECFB0]'
                : 'text-[#3A5250]'
            }`
          }
        >
          {item.icon}
          {!item.special && (
            <span className="text-xs">{item.name}</span>
          )}
        </NavLink>
      ))}

    </nav>
  );
}

export default MobileNav;