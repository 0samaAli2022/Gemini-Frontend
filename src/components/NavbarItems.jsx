import React from 'react';
import { Link } from 'react-router-dom';

const NavbarItems = () => (
  <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
    <div className="flex-shrink-0">
      <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
        Gemini App
      </Link>
    </div>
    <div className="hidden sm:block sm:ml-6">
      <div className="flex space-x-4">
        {['Home'].map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase()}`}
            className="text-gray-900 dark:text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default NavbarItems;
