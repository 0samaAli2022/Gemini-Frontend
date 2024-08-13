import React, { useState, useRef, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../contexts/NotificationProvider';
import NotificationList from './NotificationList';

const NotificationIcon = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { unreadCount } = useNotifications();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

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

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array ensures effect only runs on mount and unmount

  return (
    <div className="ml-3 relative">
      <button
        onClick={toggleDropdown}
        className="relative flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        aria-haspopup="true"
      >
        <span className="sr-only">View notifications</span>
        <FaBell className="h-5 w-5 text-gray-900 dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 left-2 inline-block w-4 h-4 bg-red-600 rounded-full text-white text-xs leading-tight text-center">
            {unreadCount}
          </span>
        )}
      </button>
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-96 max-w-sm rounded-md shadow-lg bg-white ring-1 ring-gray-200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <NotificationList />
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
