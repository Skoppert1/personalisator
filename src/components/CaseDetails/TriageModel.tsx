
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TriageModel = () => {
  return (
    <div className="border rounded-md">
      <div className="bg-syntilio-purple text-white p-3 flex justify-between items-center">
        <h3 className="text-md font-semibold">N5 - Triagemodel Zorgcentrale</h3>
        <div className="text-sm">Vragen beantwoord: 0 van 2</div>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-start mb-2">
            <span className="text-red-500 mr-1">*</span>
            <div>
              <div className="font-semibold">Zorgprobleem</div>
              <div className="text-sm text-gray-500">Over welk zorgprobleem gaat de melding?</div>
            </div>
          </div>
          
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecteer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pijn">Pijn</SelectItem>
              <SelectItem value="ademhaling">Ademhaling</SelectItem>
              <SelectItem value="mobiliteit">Mobiliteit</SelectItem>
              <SelectItem value="algemeen">Algemeen</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <div className="mb-2">
            <div className="font-semibold">Urgentiecode</div>
            <div className="text-sm text-gray-500">Welke urgentiecode heeft deze melding?</div>
          </div>
          
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="u1">U1 - Levensbedreigend</SelectItem>
              <SelectItem value="u2">U2 - Spoed</SelectItem>
              <SelectItem value="u3">U3 - Dringend</SelectItem>
              <SelectItem value="u4">U4 - Routine</SelectItem>
              <SelectItem value="u5">U5 - Advies</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-4">
          <div className="mb-2">
            <div className="font-semibold">Knowledge</div>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm">Voorgestelde artikelen</div>
            <Button variant="outline" size="sm" className="text-sm">Nieuw artikel</Button>
          </div>
          
          <div className="relative">
            <Input placeholder="Zoeken in Knowledge..." className="pl-8" />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">🔍</span>
            <Button variant="outline" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              Filters
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end p-4 border-t">
        <Button className="bg-syntilio-purple hover:bg-syntilio-purple/90 text-white">
          Volgende
        </Button>
      </div>
    </div>
  );
};

export default TriageModel;
