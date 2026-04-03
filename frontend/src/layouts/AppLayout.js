import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MobileNav from '../components/layout/MobileNav';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[#F4F7F6]">

      {/* Overlay mobile — fond sombre derrière la sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 lg:ml-60">

        {/* Topbar */}
        <Topbar onMenuClick={toggleSidebar} />

        {/* Page en cours */}
        <main className="flex-1 p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>

      </div>

      {/* Navigation mobile bas d'écran */}
      <MobileNav />

    </div>
  );
}

export default AppLayout;