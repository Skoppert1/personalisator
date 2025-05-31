
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ClientSearchProps {
  onContactSelect?: (contactId: string) => void;
  selectedContact?: string;
  isInCall?: boolean;
  communicationStyle?: string;
  communicationChannel?: string;
  onStyleChange?: (style: string) => void;
  onChannelChange?: (channel: string) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({ 
  onContactSelect, 
  selectedContact, 
  isInCall,
  communicationStyle = 'informal',
  communicationChannel = 'telegram',
  onStyleChange,
  onChannelChange
}) => {
  const handleContactSelection = (contactId: string) => {
    if (onContactSelect) {
      onContactSelect(contactId);
    }
  };

  const getContactName = (contactId: string) => {
    switch (contactId) {
      case 'contact1':
        return 'Jan de Jong';
      case 'contact2':
        return 'Anna de Vries';
      case 'contact3':
        return 'Berend van Dijk';
      default:
        return '';
    }
  };

  const getStyleDisplayName = (style: string) => {
    switch (style) {
      case 'formal':
        return 'Formeel';
      case 'warm':
        return 'Warm';
      case 'concise':
        return 'Beknopt';
      case 'visual':
        return 'Visueel';
      case 'informal':
        return 'Informeel & Vriendelijk';
      default:
        return style;
    }
  };

  const getChannelDisplayName = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'E-mail';
      case 'whatsapp':
        return 'WhatsApp';
      case 'telegram':
        return 'Telegram';
      case 'sms':
        return 'SMS';
      case 'app':
        return 'App';
      case 'portal':
        return 'Portaal';
      case 'voice':
        return 'Spraak';
      default:
        return channel;
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
          {isInCall ? 'Inkomend gesprek' : 'Beller is cliënt'}
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
          <Select onValueChange={handleContactSelection} value={selectedContact}>
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
          <Select onValueChange={handleContactSelection} value={selectedContact}>
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

        {/* Communication Preferences Section */}
        {selectedContact && (
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-semibold mb-3 text-gray-700">Communicatie Voorkeuren</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">Stijl</label>
                <Select value={communicationStyle} onValueChange={onStyleChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formeel</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="concise">Beknopt</SelectItem>
                    <SelectItem value="visual">Visueel</SelectItem>
                    <SelectItem value="informal">Informeel & Vriendelijk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">Kanaal</label>
                <Select value={communicationChannel} onValueChange={onChannelChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="app">App</SelectItem>
                    <SelectItem value="portal">Portaal</SelectItem>
                    <SelectItem value="voice">Spraak</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedContact && (
                <div className="bg-blue-50 p-3 rounded-lg mt-3">
                  <div className="text-sm text-blue-800">
                    <div className="font-medium">{getContactName(selectedContact)}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {getStyleDisplayName(communicationStyle)} • {getChannelDisplayName(communicationChannel)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSearch;
