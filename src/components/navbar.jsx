import React, { useState } from 'react';
import SettingsModal from '../components/SettingsModal';
import MobileMenuButton from './MobileMenuButton';
import NavbarItems from './NavbarItems';
import UserMenu from './UserMenu';
import NotificationIcon from './NotificationIcon';

const NavBar = () => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <MobileMenuButton />
            <NavbarItems />
            <div className="flex items-center">
              <NotificationIcon />
              <UserMenu setSettingsModalOpen={setSettingsModalOpen} />
            </div>
          </div>
        </div>
      </nav>
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </>
  );
};

export default NavBar;
