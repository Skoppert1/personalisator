
import React, { useState } from 'react';
import Header from '@/components/Header';
import CaseHeader from '@/components/CaseHeader';
import CaseDetails from '@/components/CaseDetails';
import StatusWorkflow from '@/components/StatusWorkflow';
import ClientSearch from '@/components/ClientSearch';
import MedicalNotes from '@/components/MedicalNotes';
import Appointments from '@/components/Appointments';
import CaseInfo from '@/components/CaseDetails/CaseInfo';
import TriageModel from '@/components/CaseDetails/TriageModel';
import CommunicationPanel from '@/components/CommunicationPanel';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [isInCall, setIsInCall] = useState(false);
  const [incomingCallContact, setIncomingCallContact] = useState<string>('');

  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId);
  };

  // Simulate incoming call - this would normally be triggered by your phone system
  const simulateIncomingCall = (contactId: string) => {
    setIncomingCallContact(contactId);
    setIsInCall(true);
    setSelectedContact(contactId);
  };

  const endCall = () => {
    setIsInCall(false);
    setIncomingCallContact('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-syntilio-light">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 max-w-screen-xl">
        <div className="bg-white rounded-md shadow overflow-hidden">
          <CaseHeader />
          <CaseDetails />
          <StatusWorkflow currentStatus="Nieuw" />
          
          <div className="p-4">
            {/* Demo buttons for testing incoming calls */}
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Demo: Simuleer inkomend gesprek</h4>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => simulateIncomingCall('contact1')} variant="outline">
                  Jan de Jong belt
                </Button>
                <Button size="sm" onClick={() => simulateIncomingCall('contact2')} variant="outline">
                  Anna de Vries belt
                </Button>
                <Button size="sm" onClick={() => simulateIncomingCall('contact3')} variant="outline">
                  Berend van Dijk belt
                </Button>
                {isInCall && (
                  <Button size="sm" onClick={endCall} variant="destructive">
                    Gesprek beëindigen
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <ClientSearch onContactSelect={handleContactSelect} />
                <MedicalNotes />
                <Appointments />
              </div>
              
              <div className="lg:col-span-2 space-y-4">
                <CaseInfo />
                <TriageModel />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <CommunicationPanel 
        selectedContact={selectedContact} 
        isInCall={isInCall}
        preferredStyle={isInCall ? (incomingCallContact === 'contact1' ? 'formal' : 'informal') : undefined}
      />
    </div>
  );
};

export default Index;
