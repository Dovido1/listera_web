import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="min-h-screen flex">

      {/* Côté gauche — visuel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0F0E] flex-col justify-between p-12">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
            <path d="M18 2 L32 10 L32 26 L18 34 L4 26 L4 10 Z" 
              fill="none" stroke="#0ECFB0" strokeWidth="1.2" opacity="0.4"/>
            <path d="M18 7 L28 13 L28 25 L18 31 L8 25 L8 13 Z" 
              fill="rgba(14,207,176,0.07)" stroke="#0ECFB0" strokeWidth="0.8" opacity="0.7"/>
            <path d="M13 11 L13 25 L24 25" 
              stroke="#0ECFB0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="24" cy="18" r="2" fill="#0ECFB0"/>
          </svg>
          <span className="text-white font-bold text-2xl tracking-tight">
            Listera
          </span>
        </div>

        {/* Texte central */}
        <div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Vendez partout,<br />
            <span className="text-[#0ECFB0]">gérez ici.</span>
          </h1>
          <p className="text-[#7A9E9B] text-lg leading-relaxed">
            Synchronisez vos produits sur eBay, Etsy, Mercari, 
            Poshmark et plus — depuis une seule interface.
          </p>
        </div>

        {/* Stats du bas */}
        <div className="flex gap-8">
          <div>
            <div className="text-[#0ECFB0] text-2xl font-bold">5+</div>
            <div className="text-[#7A9E9B] text-sm">Marketplaces</div>
          </div>
          <div>
            <div className="text-[#0ECFB0] text-2xl font-bold">100%</div>
            <div className="text-[#7A9E9B] text-sm">Automatisé</div>
          </div>
          <div>
            <div className="text-[#0ECFB0] text-2xl font-bold">0</div>
            <div className="text-[#7A9E9B] text-sm">Survente</div>
          </div>
        </div>
      </div>

      {/* Côté droit — formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F4F7F6]">
        <div className="w-full max-w-md">

          {/* Logo mobile uniquement */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <path d="M18 2 L32 10 L32 26 L18 34 L4 26 L4 10 Z" 
                fill="none" stroke="#0ECFB0" strokeWidth="1.2" opacity="0.4"/>
              <path d="M13 11 L13 25 L24 25" 
                stroke="#0ECFB0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="24" cy="18" r="2" fill="#0ECFB0"/>
            </svg>
            <span className="text-[#0A0F0E] font-bold text-xl">Listera</span>
          </div>

          {/* Contenu de la page (Login ou Register) */}
          <Outlet />

        </div>
      </div>

    </div>
  );
}

export default AuthLayout;