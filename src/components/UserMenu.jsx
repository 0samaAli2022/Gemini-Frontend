import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

const UserMenu = ({ setSettingsModalOpen }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('button')
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="ml-3 relative">
      <div className="flex items-center">
        <button
          onClick={toggleDropdown}
          className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          id="user-menu"
          aria-haspopup="true"
        >
          <span className="sr-only">Open user menu</span>
          <img
            className="h-8 w-8 rounded-full"
            src={
              user && user.profile && user.profile.photo
                ? user.profile.photo
                : '/default-user-photo.jpg'
            }
            alt=""
          />
        </button>
        <span
          onClick={toggleDropdown}
          className="ml-2 text-gray-900 dark:text-white hover:cursor-pointer"
        >
          {user && user.name}
        </span>
      </div>
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <Link
            to={`/profile/${user.id}`}
            className="block px-4 py-2 text-sm text-gray-700"
            role="menuitem"
            onClick={toggleDropdown}
          >
            Your Profile
          </Link>
          <button
            className="block px-4 py-2 text-sm text-gray-700"
            role="menuitem"
            onClick={() => setSettingsModalOpen(true)}
          >
            Settings
          </button>
          <button
            onClick={logout}
            className="block px-4 py-2 text-sm text-gray-700"
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
