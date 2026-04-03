import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex items-center 
      justify-center p-6">
      <div className="text-center max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <path d="M18 2 L32 10 L32 26 L18 34 L4 26 L4 10 Z"
              fill="none" stroke="#0ECFB0" strokeWidth="1.2" opacity="0.4"/>
            <path d="M13 11 L13 25 L24 25"
              stroke="#0ECFB0" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="24" cy="18" r="2" fill="#0ECFB0"/>
          </svg>
          <span className="text-[#0A0F0E] font-bold text-xl">Listera</span>
        </div>

        {/* 404 */}
        <h1 className="text-8xl font-bold text-[#0ECFB0] mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-[#0A0F0E] mb-3">
          Page introuvable
        </h2>
        <p className="text-[#5A7270] mb-8">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="bg-[#0ECFB0] hover:bg-[#09A88E] text-[#0A0F0E]
            font-semibold px-8 py-3 rounded-xl transition-all duration-200
            hover:shadow-lg hover:shadow-[#0ECFB0]/25"
        >
          Retour au Dashboard
        </button>

      </div>
    </div>
  );
}

export default NotFound;