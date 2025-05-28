import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface CommunicationPanelProps {
  selectedContact?: string;
}

const CommunicationPanel: React.FC<CommunicationPanelProps> = ({ selectedContact }) => {
  const [communicationStyle, setCommunicationStyle] = useState('informal');
  const [communicationChannel, setCommunicationChannel] = useState('telegram');
  const [isOpen, setIsOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const { toast } = useToast();
  
  // Update communication settings based on selected contact
  useEffect(() => {
    if (selectedContact === 'contact1') {
      setCommunicationStyle('formal');
      setCommunicationChannel('email');
    } else if (selectedContact === 'contact2') {
      setCommunicationStyle('informal');
      setCommunicationChannel('telegram');
    }
  }, [selectedContact]);
  
  const getMessageContent = () => {
    return quickMessage;
  };

  const sendMessage = async () => {
    if (!quickMessage.trim() || isSending) return;

    setIsSending(true);

    const messageData = {
      style: communicationStyle,
      channel: communicationChannel,
      content: getMessageContent(),
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('https://n8n.lamba.world/webhook-test/ca126202-cc73-4eb5-987d-d4680317f37e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setQuickMessage('');
      toast({
        title: "Bericht verstuurd",
        description: `Je bericht is succesvol verstuurd via ${communicationChannel}.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Fout bij versturen",
        description: "Er is iets misgegaan bij het versturen van je bericht. Probeer het opnieuw.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const sendFeedbackRequest = async () => {
    if (isSendingFeedback) return;

    setIsSendingFeedback(true);

    const feedbackData = {
      type: 'feedback_request',
      timestamp: new Date().toISOString(),
      communication_style: communicationStyle,
      communication_channel: communicationChannel
    };

    try {
      const response = await fetch('https://n8n.lamba.world/webhook-test/b679976e-ce87-4639-8440-7f7c242251a8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback request');
      }

      toast({
        title: "Feedback verzoek verstuurd",
        description: "Het feedback verzoek is succesvol verstuurd.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error sending feedback request:', error);
      toast({
        title: "Fout bij versturen",
        description: "Er is iets misgegaan bij het versturen van het feedback verzoek. Probeer het opnieuw.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSending) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <>
      {/* Floating chat button - minimalist design */}
      <div 
        className={cn(
          "fixed bottom-8 right-8 z-50 transition-all duration-500 ease-in-out",
          isOpen && "opacity-0 pointer-events-none scale-0"
        )}
      >
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-lg text-syntilio-purple rounded-full p-4 shadow-md transition-all duration-300 hover:scale-105 group h-14 w-14"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1">
              <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                !
              </Badge>
            </span>
          </Button>
          
          {/* Floating tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
              Personalisator
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Communication panel - modern minimal design */}
      <div className={cn(
        "fixed bottom-0 right-0 w-full md:w-[400px] bg-white/95 backdrop-blur-lg border-l border-t border-gray-200/50 shadow-2xl z-50 transition-all duration-500 ease-in-out transform rounded-tl-3xl overflow-hidden",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}>
        {/* Header with minimal controls */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600">Live sessie</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">3:49</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Personalization section */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="h-5 w-5 text-syntilio-purple" />
              <h3 className="text-lg font-semibold text-gray-900">Personalisator</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Automatische aanpassing van communicatie per ontvanger</p>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">Stijl</label>
                <Select value={communicationStyle} onValueChange={setCommunicationStyle}>
                  <SelectTrigger className="border-gray-200 focus:border-syntilio-purple focus:ring-syntilio-purple/20">
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
                <Select value={communicationChannel} onValueChange={setCommunicationChannel}>
                  <SelectTrigger className="border-gray-200 focus:border-syntilio-purple focus:ring-syntilio-purple/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="app">App</SelectItem>
                    <SelectItem value="portal">Portaal</SelectItem>
                    <SelectItem value="voice">Spraak</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Message input with clean design and loading state */}
            <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-4">
              <div className="flex items-end space-x-3">
                <Input 
                  placeholder="Typ je bericht..."
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  onKeyPress={handleInputKeyPress}
                  className="border-0 bg-transparent focus:ring-0 focus:ring-offset-0 text-sm"
                  disabled={isSending}
                />
                <Button 
                  size="sm" 
                  className="bg-syntilio-purple hover:bg-syntilio-purple/90 text-white rounded-xl px-4 h-9 min-w-[80px]"
                  onClick={sendMessage}
                  disabled={!quickMessage.trim() || isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Bezig...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </>
                  )}
                </Button>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Via {communicationChannel}
                {isSending && <span className="ml-2 text-syntilio-purple">• Wordt verstuurd...</span>}
              </div>
            </div>
          </div>
          
          {/* Feedback section with minimal styling */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Feedback agent</h3>
            <p className="text-sm text-gray-500 mb-4">Automatische feedback verzameling</p>
            
            <Button 
              className="w-full bg-gradient-to-r from-syntilio-purple to-syntilio-pink hover:opacity-90 text-white rounded-xl py-3 font-medium transition-all duration-300 min-h-[48px]"
              onClick={sendFeedbackRequest}
              disabled={isSendingFeedback}
            >
              {isSendingFeedback ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Feedback wordt verstuurd...
                </>
              ) : (
                'Feedback verzoek versturen'
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunicationPanel;
