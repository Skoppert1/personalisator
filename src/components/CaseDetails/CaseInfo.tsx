
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CaseInfo = () => {
  return (
    <div className="border rounded-md mb-4">
      <div className="p-4 flex items-center justify-between border-b">
        <h3 className="text-md font-semibold flex items-center">
          <div className="bg-syntilio-pink p-1 rounded text-white mr-2">
            <span>📋</span>
          </div>
          <span>Bijzonderheden Case</span>
        </h3>
        <span>▼</span>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Melding</div>
          <div className="font-semibold text-syntilio-pink">Telefonische Melding - N5</div>
          <button className="text-gray-500 ml-auto">✏️</button>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Interne Notities</div>
          <button className="text-gray-500 ml-auto">✏️</button>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center mb-2">
          <h4 className="font-semibold">Zorgrapportage Dossier</h4>
          <span className="ml-2">▼</span>
        </div>
        
        <Tabs defaultValue="nieuw">
          <TabsList className="mb-4">
            <TabsTrigger value="nieuw" className="data-[state=active]:bg-syntilio-purple data-[state=active]:text-white">Nieuw</TabsTrigger>
            <TabsTrigger value="geschiedenis">Geschiedenis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nieuw" className="space-y-4">
            <Textarea className="min-h-[150px] resize-none" placeholder="Schrijf hier uw rapportage..." />
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Actie voor (optioneel)</div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Niemand (of selecteer voor wie)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="niemand">Niemand</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="verpleegkundige">Verpleegkundige</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Zichtbaar voor (optioneel)</div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Iedereen (of selecteer voor wie)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iedereen">Iedereen</SelectItem>
                    <SelectItem value="alleen_artsen">Alleen artsen</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button className="bg-syntilio-purple hover:bg-syntilio-purple/90 text-white">
                Verzend
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="geschiedenis">
            <div className="text-center text-gray-500 py-8">
              Geen eerdere rapportages beschikbaar
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CaseInfo;
