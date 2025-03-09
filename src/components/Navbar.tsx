import React from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Home, LogOut } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Receipt className="h-8 w-8 text-[#F8BF1E]" />
              <span className="text-xl font-bold">ReceiptManager</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-[#F8BF1E]">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-[#F8BF1E]">
              <Receipt className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <button className="flex items-center space-x-1 text-gray-700 hover:text-[#F8BF1E]">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};