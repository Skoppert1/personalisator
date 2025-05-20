import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
const Header = () => {
  return <header className="sticky top-0 z-10 bg-white border-b">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-4">
          <div className="flex">
            
          </div>
          <h1 className="text-lg font-semibold">Syntilio Console</h1>
          <nav className="ml-4">
            <ul className="flex space-x-2">
              <li className="px-4 py-1 hover:bg-gray-100 rounded cursor-pointer">Hoofdpagina</li>
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center max-w-md w-full">
          <div className="relative w-full">
            <Input type="text" placeholder="Zoeken..." className="pl-8 w-full rounded-md border" />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-1 hover:bg-gray-100 rounded cursor-pointer">
            <span className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-xs">20+</span>
          </div>
          <div className="p-1 hover:bg-gray-100 rounded cursor-pointer">
            <span className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              <img src="https://via.placeholder.com/40" alt="User" className="w-full h-full object-cover" />
            </span>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;