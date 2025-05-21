
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const CommunicationPanel = () => {
  const [communicationStyle, setCommunicationStyle] = useState('formal');
  const [communicationChannel, setCommunicationChannel] = useState('email');
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Floating chat button */}
      <div 
        className={cn(
          "fixed bottom-6 right-6 z-50 transition-all duration-300",
          isOpen && "opacity-0 pointer-events-none"
        )}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="relative bg-syntilio-purple hover:bg-syntilio-purple/90 text-white rounded-full p-4 shadow-lg flex items-center justify-center group h-16 w-16"
        >
          <MessageCircle className="h-8 w-8" />
          <span className="absolute -top-2 -right-2">
            <Badge variant="destructive" className="animate-pulse">Nieuw</Badge>
          </span>
          <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap right-full mr-3 bg-black text-white px-2 py-1 rounded text-xs pointer-events-none">
            Personalisator
          </span>
        </Button>
      </div>

      {/* Communication panel */}
      <div className={cn(
        "fixed bottom-0 right-0 w-full md:w-1/3 border-t border-l bg-white shadow-lg z-50 transition-all duration-300 transform",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="flex justify-between items-center p-3 border-b bg-gray-100">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-200">
              <span>📹</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-200">
              <span>⏸️</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-200">
              <span>⏪</span>
            </Button>
          </div>
          <div className="text-sm font-medium">3:49</div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-200">
              <span>🔄</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-gray-200 hover:bg-red-100"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Personalisator</h3>
            <p className="text-sm text-gray-600 mb-4">Pas automatisch de communicatiestijl en het kanaal aan per ontvanger</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Communicatiestijl</label>
                <Select value={communicationStyle} onValueChange={setCommunicationStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formeel</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="concise">Beknopt</SelectItem>
                    <SelectItem value="visual">Visueel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Communicatiekanaal</label>
                <Select value={communicationChannel} onValueChange={setCommunicationChannel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="app">App</SelectItem>
                    <SelectItem value="portal">Portaal</SelectItem>
                    <SelectItem value="voice">Spraak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="preview">
              <TabsList className="w-full">
                <TabsTrigger value="preview" className="flex-1 data-[state=active]:bg-syntilio-purple data-[state=active]:text-white">Voorbeeld</TabsTrigger>
                <TabsTrigger value="edit" className="flex-1">Bewerken</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="bg-gray-50 p-4 rounded border mt-2">
                <div className="text-sm">
                  {communicationStyle === 'formal' && (
                    <p>Geachte heer/mevrouw, Hierbij bevestigen wij de ontvangst van uw melding. Deze zal door onze zorgcentrale worden behandeld binnen de gestelde termijn. Met vriendelijke groet, Zorgcentrale Team</p>
                  )}
                  {communicationStyle === 'warm' && (
                    <p>Hallo! Fijn dat je contact met ons hebt opgenomen. We hebben je melding goed ontvangen en gaan er meteen mee aan de slag. Je hoort snel van ons! Hartelijke groet, Jouw Zorgteam</p>
                  )}
                  {communicationStyle === 'concise' && (
                    <p>Melding ontvangen. Verwachte behandeltijd: 24 uur. We nemen contact op bij vragen.</p>
                  )}
                  {communicationStyle === 'visual' && (
                    <div>
                      <p>📬 Melding ontvangen!</p>
                      <p>⏰ We behandelen je melding binnen 24 uur</p>
                      <p>📱 We sturen je een update via {communicationChannel}</p>
                      <p>👋 Groeten van het Zorgteam</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 text-sm text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Via: {communicationChannel}</span>
                    <Button size="sm" variant="outline" className="text-syntilio-purple border-syntilio-purple">
                      Verzenden
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="edit">
                <textarea className="w-full h-32 p-3 border rounded mt-2" placeholder="Schrijf hier uw aangepaste bericht..."></textarea>
                <div className="flex justify-end mt-2">
                  <Button className="bg-syntilio-purple hover:bg-syntilio-purple/90 text-white">
                    Opslaan
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-2">Feedback agent</h3>
            <p className="text-sm text-gray-600 mb-2">Vraag automatisch feedback aan de betrokkenen</p>
            
            <Button className="w-full bg-syntilio-purple hover:bg-syntilio-purple/90 text-white">
              Feedback verzoek versturen
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunicationPanel;
