
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, X, Play, Pause, RotateCcw, Video, Send, Sparkles, Heart, MessageSquare, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const CommunicationPanel = () => {
  const [communicationStyle, setCommunicationStyle] = useState('formal');
  const [communicationChannel, setCommunicationChannel] = useState('email');
  const [isOpen, setIsOpen] = useState(false);
  
  const styleIcons = {
    formal: MessageSquare,
    warm: Heart,
    concise: MessageCircle,
    visual: Eye
  };

  const channelEmojis = {
    email: '📧',
    sms: '💬',
    app: '📱',
    portal: '🌐',
    voice: '🎙️'
  };
  
  return (
    <>
      {/* Floating chat button with glow effect */}
      <div 
        className={cn(
          "fixed bottom-6 right-6 z-50 transition-all duration-300",
          isOpen && "opacity-0 pointer-events-none"
        )}
      >
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-r from-syntilio-purple to-syntilio-pink hover:from-syntilio-purple/90 hover:to-syntilio-pink/90 text-white rounded-full p-5 shadow-2xl flex items-center justify-center group h-16 w-16 transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="h-7 w-7" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-syntilio-purple to-syntilio-pink opacity-75 animate-pulse"></div>
          </Button>
          
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 animate-bounce bg-red-500 text-white border-2 border-white shadow-lg"
          >
            Nieuw
          </Badge>
          
          <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap right-full mr-4 top-1/2 transform -translate-y-1/2">
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Personalisator
              </div>
              <div className="absolute top-1/2 left-full w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern communication panel */}
      <div className={cn(
        "fixed bottom-0 right-0 w-full md:w-96 border-l bg-white shadow-2xl z-50 transition-all duration-500 transform",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}>
        {/* Header with controls */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white shadow-sm hover:bg-gray-50">
                <Video className="h-4 w-4 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white shadow-sm hover:bg-gray-50">
                <Pause className="h-4 w-4 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white shadow-sm hover:bg-gray-50">
                <RotateCcw className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">3:49</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full bg-white shadow-sm hover:bg-red-50 hover:text-red-600"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Personalisator section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-syntilio-purple to-syntilio-pink flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Personalisator</h3>
                <p className="text-sm text-gray-500">AI-gestuurde communicatie</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100 mb-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                Pas automatisch de communicatiestijl en het kanaal aan per ontvanger voor optimale bereikbaarheid
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Communicatiestijl
                </label>
                <Select value={communicationStyle} onValueChange={setCommunicationStyle}>
                  <SelectTrigger className="border-gray-200 bg-white hover:border-syntilio-purple transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">📋 Formeel</SelectItem>
                    <SelectItem value="warm">💝 Warm</SelectItem>
                    <SelectItem value="concise">⚡ Beknopt</SelectItem>
                    <SelectItem value="visual">🎨 Visueel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Communicatiekanaal
                </label>
                <Select value={communicationChannel} onValueChange={setCommunicationChannel}>
                  <SelectTrigger className="border-gray-200 bg-white hover:border-syntilio-purple transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">📧 E-mail</SelectItem>
                    <SelectItem value="sms">💬 SMS</SelectItem>
                    <SelectItem value="app">📱 App</SelectItem>
                    <SelectItem value="portal">🌐 Portaal</SelectItem>
                    <SelectItem value="voice">🎙️ Spraak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="w-full bg-gray-100">
                <TabsTrigger 
                  value="preview" 
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-syntilio-purple data-[state=active]:shadow-sm"
                >
                  👁️ Voorbeeld
                </TabsTrigger>
                <TabsTrigger 
                  value="edit" 
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-syntilio-purple data-[state=active]:shadow-sm"
                >
                  ✏️ Bewerken
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="mt-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="text-sm leading-relaxed text-gray-800">
                    {communicationStyle === 'formal' && (
                      <div className="space-y-2">
                        <p className="font-medium">Geachte heer/mevrouw,</p>
                        <p>Hierbij bevestigen wij de ontvangst van uw melding. Deze zal door onze zorgcentrale worden behandeld binnen de gestelde termijn.</p>
                        <p>Met vriendelijke groet,<br/>Zorgcentrale Team</p>
                      </div>
                    )}
                    {communicationStyle === 'warm' && (
                      <div className="space-y-2">
                        <p>Hallo! 👋</p>
                        <p>Fijn dat je contact met ons hebt opgenomen. We hebben je melding goed ontvangen en gaan er meteen mee aan de slag. Je hoort snel van ons!</p>
                        <p>Hartelijke groet,<br/>Jouw Zorgteam 💙</p>
                      </div>
                    )}
                    {communicationStyle === 'concise' && (
                      <div className="space-y-1">
                        <p>✅ Melding ontvangen</p>
                        <p>⏰ Behandeltijd: 24 uur</p>
                        <p>📞 We nemen contact op bij vragen</p>
                      </div>
                    )}
                    {communicationStyle === 'visual' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📬</span>
                          <span className="font-medium">Melding ontvangen!</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">⏰</span>
                          <span>We behandelen je melding binnen 24 uur</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{channelEmojis[communicationChannel]}</span>
                          <span>We sturen je een update via {communicationChannel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">👋</span>
                          <span>Groeten van het Zorgteam</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{channelEmojis[communicationChannel]}</span>
                      <span>Via: {communicationChannel}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-syntilio-purple to-syntilio-pink hover:from-syntilio-purple/90 hover:to-syntilio-pink/90 text-white shadow-sm"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Verzenden
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="edit" className="mt-4">
                <div className="space-y-4">
                  <Textarea 
                    className="min-h-[120px] border-gray-200 focus:border-syntilio-purple focus:ring-syntilio-purple" 
                    placeholder="Schrijf hier uw aangepaste bericht..."
                  />
                  <div className="flex justify-end">
                    <Button className="bg-gradient-to-r from-syntilio-purple to-syntilio-pink hover:from-syntilio-purple/90 hover:to-syntilio-pink/90 text-white shadow-sm">
                      💾 Opslaan
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Feedback agent section */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Feedback agent</h3>
                <p className="text-sm text-gray-500">Automatische feedback verzameling</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl border border-green-100 mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Vraag automatisch feedback aan de betrokkenen om de zorgverlening continu te verbeteren
              </p>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-sm h-12 text-base font-medium">
              <Heart className="h-4 w-4 mr-2" />
              Feedback verzoek versturen
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunicationPanel;
