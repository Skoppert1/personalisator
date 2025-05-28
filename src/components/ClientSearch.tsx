
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ClientSearchProps {
  onContactSelect?: (contactId: string) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({ onContactSelect }) => {
  const handleContactSelection = (contactId: string) => {
    if (onContactSelect) {
      onContactSelect(contactId);
    }
  };

  return (
    <div className="border rounded-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold flex items-center">
          Zoek Cliënt / Beller
          <span className="ml-2 w-5 h-5 rounded-full border flex items-center justify-center text-sm">?</span>
        </h3>
        <div className="bg-gray-200 text-sm px-3 py-1 rounded">
          Beller is cliënt
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-purple-800 rounded-full flex items-center justify-center text-white mr-2">
              <span>👤</span>
            </div>
            <span className="font-medium">Cliënt</span>
          </div>
          <Select onValueChange={handleContactSelection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Zoek contact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contact1">Jan de Jong</SelectItem>
              <SelectItem value="contact2">Anna de Vries</SelectItem>
              <SelectItem value="contact3">Berend van Dijk</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-purple-800 mr-2">
              <span>📞</span>
            </div>
            <span className="font-medium">Beller</span>
          </div>
          <Select onValueChange={handleContactSelection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Zoek contact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contact1">Jan de Jong</SelectItem>
              <SelectItem value="contact2">Anna de Vries</SelectItem>
              <SelectItem value="contact3">Berend van Dijk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ClientSearch;
