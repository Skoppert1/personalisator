
import React from 'react';

const CaseDetails = () => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 border-b">
      <div>
        <div className="text-sm text-gray-500">Casenummer</div>
        <div className="font-semibold">00001961</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Contacttype</div>
        <div>&nbsp;</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Melding</div>
        <div className="font-semibold text-syntilio-pink">Telefonische Melding - N5</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Openingsdatum/-tijd</div>
        <div className="font-semibold">07-04-2025 08:54</div>
      </div>
      <div className="col-span-3">
        <div className="text-sm text-gray-500">Case-eigenaar</div>
        <div className="flex items-center">
          <span className="inline-block w-6 h-6 bg-gray-200 rounded-full mr-2"></span>
          <span className="text-syntilio-pink">Syntilio Testing</span>
          <span className="ml-2">↗</span>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
