
import React from 'react';
import { Button } from '@/components/ui/button';

const CaseHeader = () => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center">
        <div className="bg-syntilio-pink p-3 rounded text-white mr-4">
          <span className="text-xl">Case</span>
        </div>
        <h2 className="text-lg font-semibold">Case</h2>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline">Aan mij toewijzen</Button>
        <div className="relative">
          <Button variant="outline">Dossier</Button>
          <span className="absolute right-0 top-0 transform translate-x-1/4 -translate-y-1/4 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full text-xs">▼</span>
        </div>
      </div>
    </div>
  );
};

export default CaseHeader;
