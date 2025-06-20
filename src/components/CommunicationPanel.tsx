import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send, Sparkles, Loader2, Phone, User, Search, FileText, CheckCircle, Edit3, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WebhookResponse {
  id: string;
  originalMessage: string;
  generatedMessage: string;
  recipient: string;
  channel: string;
  style: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'sent';
}

interface CommunicationPanelProps {
  selectedContact?: string;
  isInCall?: boolean;
  communicationStyle?: string;
  communicationChannel?: string;
}

function hasHeaders(obj: any): obj is { headers: any } {
  return obj != null && typeof obj === 'object' && 'headers' in obj;
}

const CommunicationPanel: React.FC<CommunicationPanelProps> = ({ 
  selectedContact, 
  isInCall = false,
  communicationStyle = 'informal',
  communicationChannel = 'telegram'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [contactType, setContactType] = useState<'client' | 'informeel' | 'formeel' | 'review'>('client');
  const [selectedInformalCare, setSelectedInformalCare] = useState<string[]>([]);
  const [selectedFormalCare, setSelectedFormalCare] = useState<string>('');
  const [formalCareOpen, setFormalCareOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<number>(0);
  const [showAllSentDialog, setShowAllSentDialog] = useState(false);
  const [webhookResponses, setWebhookResponses] = useState<WebhookResponse[]>([]);
  const [editingResponse, setEditingResponse] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState<string>('');
  const [isSendingToFinal, setIsSendingToFinal] = useState<string | null>(null);
  
  const [formalCareForm, setFormalCareForm] = useState({
    client: '',
    reason: '',
    medicalHistory: '',
    instructions: '',
    socialFactors: '',
    followUp: '',
    practical: '',
    customMessage: ''
  });
  
  const { toast } = useToast();

  const parseWebhookResponse = (responseText: string) => {
    try {
      let jsonData = JSON.parse(responseText);
      // Als het een array is, zoek naar een object met output of response.body.output
      if (Array.isArray(jsonData)) {
        for (const item of jsonData) {
          // n8n response: { response: { body: { output: ... } } }
          if (item && item.response && item.response.body && item.response.body.output) {
            return {
              message: item.response.body.output,
              contact: ''
            };
          }
          // n8n response: { output: ... }
          if (item && item.output) {
            return {
              message: item.output,
              contact: ''
            };
          }
          // n8n response: { message: ..., contact: ... }
          if (item && item.message && item.contact) {
            return {
              message: item.message,
              contact: item.contact
            };
          }
        }
        // Fallback: pak eerste item met alleen message
        if (jsonData[0] && jsonData[0].message) {
          return {
            message: jsonData[0].message,
            contact: ''
          };
        }
      } else if (jsonData && jsonData.message && jsonData.contact) {
        return {
          message: jsonData.message,
          contact: jsonData.contact
        };
      } else if (jsonData && jsonData.message) {
        return {
          message: jsonData.message,
          contact: ''
        };
      }
    } catch (e) {
      // Als het geen JSON is, ga er vanuit dat het een platte tekst is
      if (typeof responseText === 'string' && responseText.trim().length > 0) {
        return {
          message: responseText,
          contact: ''
        };
      }
      console.log('Not JSON, parsing as text format');
    }

    const messageMatch = responseText.match(/message:\s*(.+?)(?=\ncontact:|$)/s);
    const contactMatch = responseText.match(/contact:\s*(.+?)(?=\nmessage:|$)/s);

    if (messageMatch && contactMatch) {
      return {
        message: messageMatch[1].trim(),
        contact: contactMatch[1].trim()
      };
    }

    const altMessageMatch = responseText.match(/bericht:\s*(.+?)(?=\ncontact:|$)/s);
    const altContactMatch = responseText.match(/ontvanger:\s*(.+?)(?=\nbericht:|$)/s);

    if (altMessageMatch && altContactMatch) {
      return {
        message: altMessageMatch[1].trim(),
        contact: altContactMatch[1].trim()
      };
    }

    console.log('Could not parse webhook response:', responseText);
    return null;
  };

  useEffect(() => {
    const handleWebhookResponse = () => {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        
        if (args[0] && typeof args[0] === 'string' && args[0].includes('n8n.lamba.world/webhook/ca126202-cc73-4eb5-987d-d4680317f37e')) {
          const responseClone = response.clone();
          
          try {
            const responseText = await responseClone.text();
            console.log('Webhook response received:', responseText);
            
            const parsedData = parseWebhookResponse(responseText);
            
            if (parsedData) {
              const newResponse: WebhookResponse = {
                id: `response-${Date.now()}`,
                originalMessage: '',
                generatedMessage: parsedData.message,
                recipient: parsedData.contact,
                channel: communicationChannel,
                style: communicationStyle,
                timestamp: new Date().toISOString(),
                status: 'pending'
              };
              
              setWebhookResponses(prev => [newResponse, ...prev]);
              
              toast({
                title: "Nieuw bericht ontvangen",
                description: `Bericht voor ${parsedData.contact} is klaar voor review.`,
                duration: 4000,
              });
            }
          } catch (error) {
            console.error('Error parsing webhook response:', error);
          }
        }
        
        return response;
      };

      return () => {
        window.fetch = originalFetch;
      };
    };

    const cleanup = handleWebhookResponse();
    return cleanup;
  }, [communicationChannel, communicationStyle, toast]);

  useEffect(() => {
    setFormalCareForm({
      client: '',
      reason: '',
      medicalHistory: '',
      instructions: '',
      socialFactors: '',
      followUp: '',
      practical: '',
      customMessage: ''
    });
  }, [selectedContact]);

  const informalCareContacts = [
    { id: 'informal1', name: 'Contact 1 - Partner' },
    { id: 'informal2', name: 'Contact 2 - Zus' },
    { id: 'informal3', name: 'Contact 3 - Buurman' },
    { id: 'informal4', name: 'Contact 4 - Vriend' },
  ];

  const formalCareContacts = [
    { id: 'formal1', name: 'Maria van der Berg' },
    { id: 'formal2', name: 'Kees Jansen' },
    { id: 'formal3', name: 'Linda Bakker' },
    { id: 'formal4', name: 'Ahmed Hassan' },
  ];
  
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

  const getExampleDataForContact = (contactId: string) => {
    switch (contactId) {
      case 'contact1':
        return {
          client: 'Dhr. Jan de Jong, 65 jaar, adres: Kerkstraat 45, 2345 CD Utrecht, sleutelkluisje code 1234',
          reason: 'Acute pijn op de borst, mogelijk hartklachten. Urgentie: U2 (binnen 1 uur beoordelen)',
          medicalHistory: 'Hypertensie, gebruikt lisinopril 10 mg 1x daags, rookverleden 20 jaar geleden gestopt',
          instructions: 'ECG maken, vitale functies controleren (bloeddruk, hartslag, saturatie), neem EHBO-tas mee. Volg protocol acute thoracale pijn',
          socialFactors: 'Cliënt spreekt Nederlands en Engels, woont met echtgenote, geen huisdieren. Echtgenote is thuis aanwezig',
          followUp: 'Rapporteer bevindingen direct in ECD en bel cardioloog (06-87654321) bij afwijkingen',
          practical: 'Bezoek zo spoedig mogelijk, parkeren mogelijk achter het huis'
        };
      case 'contact2':
        return {
          client: 'Mevr. Anna de Vries, 78 jaar, adres: Hoofdstraat 12, 1234 AB Amsterdam, sleutelkluisje code 5678',
          reason: 'Pijnlijke zwelling linkerbeen, mogelijk trombose. Urgentie: U3 (binnen 4 uur beoordelen)',
          medicalHistory: 'Diabetes type 2, gebruikt metformine 500 mg 2x daags, geen bekende allergieën',
          instructions: 'Beoordeel zwelling, meet vitale functies (bloeddruk, pols), neem verbandmateriaal mee. Volg protocol tromboseverdacht',
          socialFactors: 'Cliënt spreekt Nederlands, woont alleen, geen huisdieren. Dochter is mogelijk aanwezig',
          followUp: 'Rapporteer bevindingen in ECD en bel triagist (06-12345678) bij afwijkingen',
          practical: 'Bezoek tussen 14:00-15:00, parkeren mogelijk voor de deur'
        };
      case 'contact3':
        return {
          client: 'Dhr. Berend van Dijk, 82 jaar, adres: Dorpsstraat 28, 5678 EF Eindhoven, sleutelkluisje code 9876',
          reason: 'Verwardheid en vallen, mogelijk medicatie-interactie. Urgentie: U3 (binnen 4 uur beoordelen)',
          medicalHistory: 'Dementie, hartfalen, gebruikt digoxine 0,25 mg 1x daags en furosemide 40 mg 1x daags',
          instructions: 'Cognitieve beoordeling, medicatie-review, val-risico inschatten. Neem bloeddrukmeter en glucosemeter mee',
          socialFactors: 'Cliënt spreekt dialect, woont alleen, heeft kat. Zoon woont in de buurt en heeft sleutel',
          followUp: 'Overleg met geriater (06-98765432) en rapporteer in ECD. Mogelijk medicatie-aanpassing nodig',
          practical: 'Bezoek tussen 10:00-12:00, bel aan bij buren (nummer 26) als geen gehoor'
        };
      default:
        return {
          client: '',
          reason: '',
          medicalHistory: '',
          instructions: '',
          socialFactors: '',
          followUp: '',
          practical: ''
        };
    }
  };

  const fillExampleData = () => {
    const exampleData = getExampleDataForContact(selectedContact || '');
    setFormalCareForm(prev => ({
      ...prev,
      ...exampleData
    }));
    
    toast({
      title: "Voorbeelddata ingevuld",
      description: "Alle velden zijn automatisch ingevuld met voorbeelddata.",
      duration: 3000,
    });
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

  const getContactTypeDisplayName = (type: 'client' | 'informeel' | 'formeel' | 'review') => {
    switch (type) {
      case 'client':
        return 'Cliënt';
      case 'informeel':
        return 'Informeel';
      case 'formeel':
        return 'Formeel';
      case 'review':
        return 'Review';
      default:
        return type;
    }
  };

  const getSelectedContactNames = () => {
    if (contactType === 'client') {
      return getContactName(selectedContact || '');
    } else if (contactType === 'informeel') {
      return selectedInformalCare.map(id => 
        informalCareContacts.find(contact => contact.id === id)?.name || ''
      ).filter(Boolean).join(', ');
    } else if (contactType === 'formeel') {
      return formalCareContacts.find(contact => contact.id === selectedFormalCare)?.name || '';
    }
    return '';
  };
  
  const getMessageContent = () => {
    if (contactType === 'formeel') {
      const structuredMessage = `Cliënt: ${formalCareForm.client}
Reden: ${formalCareForm.reason}
Medische voorgeschiedenis: ${formalCareForm.medicalHistory}
Instructies: ${formalCareForm.instructions}
Sociale factoren: ${formalCareForm.socialFactors}
Follow-up: ${formalCareForm.followUp}
Praktisch: ${formalCareForm.practical}`;

      if (formalCareForm.customMessage.trim()) {
        return formalCareForm.customMessage + '\n\n' + structuredMessage;
      }
      return structuredMessage;
    }
    return quickMessage;
  };

  const handleInformalCareChange = (contactId: string, checked: boolean) => {
    setSelectedInformalCare(prev => 
      checked 
        ? [...prev, contactId]
        : prev.filter(id => id !== contactId)
    );
  };

  const handleFormalCareFormChange = (field: string, value: string) => {
    setFormalCareForm(prev => ({ ...prev, [field]: value }));
  };

  const startEditing = (response: WebhookResponse) => {
    setEditingResponse(response.id);
    setEditedMessage(response.generatedMessage);
  };

  const cancelEditing = () => {
    setEditingResponse(null);
    setEditedMessage('');
  };

  const saveEdit = (responseId: string) => {
    setWebhookResponses(prev => 
      prev.map(response => 
        response.id === responseId 
          ? { ...response, generatedMessage: editedMessage }
          : response
      )
    );
    setEditingResponse(null);
    setEditedMessage('');
    
    toast({
      title: "Bericht bewerkt",
      description: "Het bericht is succesvol aangepast.",
      duration: 3000,
    });
  };

  const confirmAccept = async (responseId: string) => {
    if (!responseId) return;
    const response = webhookResponses.find(r => r.id === responseId);
    if (!response) return;

    setIsSendingToFinal(responseId);

    const originalMsg = response.originalMessage;
    let contactTypeValue: 'formeel' | 'informeel' | 'client' =
      contactType === 'formeel' || contactType === 'informeel' || contactType === 'client'
        ? contactType
        : 'client';
    let recipientValue = response.recipient;
    let clientNameValue = getContactName(selectedContact || '');
    if (hasHeaders(originalMsg)) {
      const headers = originalMsg.headers;
      if (headers && ['formeel', 'informeel', 'client'].includes(headers.contacttype)) {
        contactTypeValue = headers.contacttype;
      }
      if (headers && headers.recipients) {
        recipientValue = headers.recipients;
      }
      if (headers && headers.clientname) {
        clientNameValue = headers.clientname;
      }
    }

    try {
      const finalResponse = await fetch('https://n8n.lamba.world/webhook/08ce8a0f-9e5c-4df9-a1f8-173cf6db4803', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalMessage: response.originalMessage ?? '',
          finalMessage: response.generatedMessage,
          timestamp: new Date().toISOString(),
          approvedBy: 'triagist'
        }),
      });

      if (!finalResponse.ok) {
        throw new Error('Failed to send final message');
      }

      setWebhookResponses(prev => 
        prev.map(r => 
          r.id === responseId 
            ? { ...r, status: 'sent' }
            : r
        )
      );

      toast({
        title: "Bericht verstuurd",
        description: "Het goedgekeurde bericht is succesvol verstuurd.",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error sending final message:', error);
      toast({
        title: "Fout bij versturen",
        description: "Er is iets misgegaan bij het versturen van het goedgekeurde bericht.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsSendingToFinal(null);
    }
  };

  const sendMessage = async () => {
    const messageContent = getMessageContent();
    if ((!messageContent.trim() && contactType !== 'formeel') || isSending) return;

    if (contactType === 'formeel') {
      const hasCustomMessage = formalCareForm.customMessage.trim();
      const structuredFields = [
        formalCareForm.client,
        formalCareForm.reason,
        formalCareForm.medicalHistory,
        formalCareForm.instructions,
        formalCareForm.socialFactors,
        formalCareForm.followUp,
        formalCareForm.practical
      ];
      const hasAllStructuredFields = structuredFields.every(field => field.trim());

      if (!hasCustomMessage && !hasAllStructuredFields) {
        toast({
          title: "Formulier incompleet",
          description: "Vul ofwel een bericht in, ofwel alle gestructureerde velden, of beide.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
    }

    let recipients = '';
    if (contactType === 'client') {
      recipients = getContactName(selectedContact || '');
    } else if (contactType === 'informeel') {
      recipients = getSelectedContactNames();
    } else if (contactType === 'formeel') {
      recipients = getSelectedContactNames();
    }

    if (!recipients && contactType !== 'client') {
      toast({
        title: "Geen contacten geselecteerd",
        description: "Selecteer eerst contacten voordat je een bericht verstuurt.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsSending(true);
    setPendingMessages(prev => prev + 1);

    const messageData = {
      style: communicationStyle,
      channel: communicationChannel,
      content: messageContent,
      clientName: getContactName(selectedContact || ''),
      contactType: contactType,
      recipients: recipients,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('https://n8n.lamba.world/webhook/ca126202-cc73-4eb5-987d-d4680317f37e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      if (contactType === 'formeel') {
        setFormalCareForm({
          client: '',
          reason: '',
          medicalHistory: '',
          instructions: '',
          socialFactors: '',
          followUp: '',
          practical: '',
          customMessage: ''
        });
      } else {
        setQuickMessage('');
      }
      
      setTimeout(() => {
        setPendingMessages(prev => {
          const newCount = prev - 1;
          if (newCount === 0) {
            setShowAllSentDialog(true);
          }
          return newCount;
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setPendingMessages(prev => prev - 1);
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
      clientName: getContactName(selectedContact || ''),
      contactType: contactType,
      recipients: getSelectedContactNames(),
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

  const pendingResponsesCount = webhookResponses.filter(r => r.status === 'pending').length;
  
  return (
    <>
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
            {pendingResponsesCount > 0 && (
              <span className="absolute -top-1 -right-1">
                <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {pendingResponsesCount}
                </Badge>
              </span>
            )}
          </Button>
          
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
              Personalisator
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "fixed bottom-0 right-0 w-full md:w-[500px] bg-white/95 backdrop-blur-lg border-l border-t border-gray-200/50 shadow-2xl z-50 transition-all duration-500 ease-in-out transform rounded-tl-3xl overflow-hidden",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}>
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

        {(selectedContact || isInCall) && (
          <div className="bg-blue-50 border-b border-blue-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {isInCall ? (
                  <Phone className="h-4 w-4 text-blue-600" />
                ) : (
                  <User className="h-4 w-4 text-blue-600" />
                )}
                <span className="text-sm font-medium text-blue-900">
                  {isInCall ? 'Inkomend gesprek' : 'Geselecteerde cliënt'}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-sm text-blue-800 font-medium">
                {getContactName(selectedContact || '')}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                <span className="font-medium">Voorkeur:</span> {getStyleDisplayName(communicationStyle)} • {getChannelDisplayName(communicationChannel)}
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <Tabs defaultValue="client" value={contactType} onValueChange={(value) => setContactType(value as 'client' | 'informeel' | 'formeel' | 'review')}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="client">Cliënt</TabsTrigger>
              <TabsTrigger value="informeel">Informeel</TabsTrigger>
              <TabsTrigger value="formeel">Formeel</TabsTrigger>
              <TabsTrigger value="review" className="relative">
                Review
                {pendingResponsesCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
                    {pendingResponsesCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="client" className="space-y-4">
              <div className="text-center py-4">
                <p className="text-sm text-gray-600">Berichten worden verstuurd naar de geselecteerde cliënt</p>
                {selectedContact && (
                  <div className="mt-2 text-sm font-medium text-gray-800">
                    {getContactName(selectedContact)}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="informeel" className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Selecteer informele zorgcontacten</h4>
                <div className="space-y-2">
                  {informalCareContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={contact.id}
                        checked={selectedInformalCare.includes(contact.id)}
                        onCheckedChange={(checked) => handleInformalCareChange(contact.id, checked as boolean)}
                      />
                      <label htmlFor={contact.id} className="text-sm text-gray-700 cursor-pointer">
                        {contact.name}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedInformalCare.length > 0 && (
                  <div className="mt-3 p-2 bg-green-50 rounded text-xs text-green-800">
                    {selectedInformalCare.length} contact{selectedInformalCare.length > 1 ? 'en' : ''} geselecteerd
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="formeel" className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Zoek formele zorgcontact</h4>
                <Popover open={formalCareOpen} onOpenChange={setFormalCareOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={formalCareOpen}
                      className="w-full justify-between"
                    >
                      {selectedFormalCare
                        ? formalCareContacts.find(contact => contact.id === selectedFormalCare)?.name
                        : "Selecteer formele zorg contact..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Zoek contact..." />
                      <CommandList>
                        <CommandEmpty>Geen contact gevonden.</CommandEmpty>
                        <CommandGroup>
                          {formalCareContacts.map((contact) => (
                            <CommandItem
                              key={contact.id}
                              value={contact.name}
                              onSelect={() => {
                                setSelectedFormalCare(contact.id === selectedFormalCare ? '' : contact.id);
                                setFormalCareOpen(false);
                              }}
                            >
                              {contact.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedFormalCare && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                    {formalCareContacts.find(contact => contact.id === selectedFormalCare)?.name} geselecteerd
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Te reviewen berichten</h3>
                {webhookResponses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Geen berichten te reviewen</p>
                    <p className="text-xs mt-1">Webhook responses zullen hier verschijnen</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {webhookResponses.map((response) => (
                      <div key={response.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant={response.status === 'pending' ? 'default' : response.status === 'sent' ? 'default' : 'secondary'}>
                              {response.status === 'pending' ? 'Te reviewen' : response.status === 'sent' ? 'Verstuurd' : 'Geaccepteerd'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(response.timestamp).toLocaleTimeString('nl-NL', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {response.recipient} • {response.channel}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs font-medium text-gray-600">Gegenereerd bericht:</Label>
                            {editingResponse === response.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editedMessage}
                                  onChange={(e) => setEditedMessage(e.target.value)}
                                  className="min-h-[120px]"
                                />
                                <div className="flex space-x-2">
                                  <Button size="sm" onClick={() => saveEdit(response.id)}>
                                    Opslaan
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={cancelEditing}>
                                    Annuleren
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-800 bg-blue-50 p-3 rounded whitespace-pre-wrap">
                                {response.generatedMessage}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {response.status === 'pending' && editingResponse !== response.id && (
                          <div className="flex space-x-2 pt-2">
                            <Button 
                              size="sm" 
                              onClick={() => startEditing(response)}
                              variant="outline"
                              className="flex-1"
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Bewerken
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => confirmAccept(response.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              disabled={isSendingToFinal === response.id}
                            >
                              {isSendingToFinal === response.id ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  Versturen...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Accepteren & Versturen
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                        
                        {response.status === 'sent' && (
                          <div className="flex items-center space-x-2 pt-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Bericht is verstuurd</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {contactType !== 'review' && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="h-5 w-5 text-syntilio-purple" />
                <h3 className="text-lg font-semibold text-gray-900">Snel Bericht</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Verstuur naar: {getContactTypeDisplayName(contactType)}
                {getSelectedContactNames() && (
                  <span className="block font-medium text-gray-700 mt-1">
                    {getSelectedContactNames()}
                  </span>
                )}
              </p>
              
              {contactType === 'formeel' ? (
                <div className="space-y-4">
                  {selectedContact && (
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fillExampleData}
                        className="text-xs"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Invullen
                      </Button>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="client" className="text-sm font-medium">Cliënt</Label>
                      <Input
                        id="client"
                        value={formalCareForm.client}
                        onChange={(e) => handleFormalCareFormChange('client', e.target.value)}
                        className="mt-1"
                      />
                      <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        Voorbeeld: Mevr. J. de Vries, 78 jaar, adres: Hoofdstraat 12, 1234 AB Amsterdam, sleutelkluisje code 5678
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="reason" className="text-sm font-medium">Reden</Label>
                      <Textarea
                        id="reason"
                        value={formalCareForm.reason}
                        onChange={(e) => handleFormalCareFormChange('reason', e.target.value)}
                        className="mt-1 min-h-[60px]"
                      />
                      <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        Voorbeeld: Pijnlijke zwelling linkerbeen, mogelijk trombose. Urgentie: U3 (binnen 4 uur beoordelen)
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="medicalHistory" className="text-sm font-medium">Medische voorgeschiedenis</Label>
                      <Textarea
                        id="medicalHistory"
                        value={formalCareForm.medicalHistory}
                        onChange={(e) => handleFormalCareFormChange('medicalHistory', e.target.value)}
                        className="mt-1 min-h-[60px]"
                      />
                      <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        Voorbeeld: Diabetes type 2, gebruikt metformine 500 mg 2x daags, geen bekende allergieën
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="instructions" className="text-sm font-medium">Instructies</Label>
                      <Textarea
                        id="instructions"
                        value={formalCareForm.instructions}
                        onChange={(e) => handleFormalCareFormChange('instructions', e.target.value)}
                        className="mt-1 min-h-[60px]"
                      />
                      <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        Voorbeeld: Beoordeel zwelling, meet vitale functies (bloeddruk, pols), neem verbandmateriaal mee. Volg protocol tromboseverdacht
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="socialFactors" className="text-sm font-medium">Sociale factoren</Label>
                      <Textarea
                        id="socialFactors"
                        value={formalCareForm.socialFactors}
                        onChange={(e) => handleFormalCareFormChange('socialFactors', e.target.value)}
                        className="mt-1 min-h-[60px]"
                      />
                      <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        Voorbeeld: Cliënt spreekt Nederlands, woont alleen, geen huisdieren. Dochter is mogelijk aanwezig
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="followUp" className="text-sm font-medium">Follow-up</Label>
                      <Textarea
                        id="followUp"
                        value={formalCareForm.followUp}
                        onChange={(e) => handleFormalCareFormChange('followUp', e.target.value)}
                        className="mt-1 min-h-[60px]"
                      />
                      <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        Voorbeeld: Rapporteer bevindingen in ECD en bel triagist (06-12345678) bij afwijkingen
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="practical" className="text-sm font-medium">Praktisch</Label>
                      <Textarea
                        id="practical"
                        value={formalCareForm.practical}
                        onChange={(e) => handleFormalCareFormChange('practical', e.target.value)}
                        className="mt-1 min-h-[60px]"
                      />
                      <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        Voorbeeld: Bezoek tussen 14:00-15:00, parkeren mogelijk voor de deur
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customMessage" className="text-sm font-medium">Eigen bericht (optioneel)</Label>
                    <Textarea
                      id="customMessage"
                      placeholder="Voeg hier een persoonlijk bericht toe..."
                      value={formalCareForm.customMessage}
                      onChange={(e) => handleFormalCareFormChange('customMessage', e.target.value)}
                      className="mt-1 min-h-[60px]"
                    />
                  </div>
                  
                  <Button 
                    className="w-full bg-syntilio-purple hover:bg-syntilio-purple/90 text-white rounded-xl py-3 font-medium transition-all duration-300 min-h-[48px]"
                    onClick={sendMessage}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Bezig...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Verstuur naar formeel
                      </>
                    )}
                  </Button>
                </div>
              ) : (
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
                    Via {getChannelDisplayName(communicationChannel)}
                    {isSending && <span className="ml-2 text-syntilio-purple">• Wordt verstuurd...</span>}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {contactType !== 'review' && (
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
          )}
        </div>
      </div>
    </>
  );
};

export default CommunicationPanel;
