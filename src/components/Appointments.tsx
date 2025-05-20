
import React from 'react';
import { Button } from '@/components/ui/button';

const Appointments = () => {
  return (
    <div className="border rounded-md mb-4">
      <div className="p-4 flex items-center justify-between border-b">
        <h3 className="text-md font-semibold flex items-center">
          <span>Afspraken</span>
          <span className="ml-2 transform rotate-90">▶</span>
        </h3>
      </div>
      
      <div className="p-8 flex flex-col items-center justify-center text-gray-500">
        <div className="mb-2">
          <span className="text-3xl">📁</span>
        </div>
        <p className="text-sm mb-4">Geen aankomende afspraken voor de cliënt</p>
        <Button className="bg-syntilio-purple hover:bg-syntilio-purple/90 text-white">
          Ophalen
        </Button>
      </div>
    </div>
  );
};

export default Appointments;
