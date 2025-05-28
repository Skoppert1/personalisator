
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

const Index = () => {
  const [selectedContact, setSelectedContact] = useState<string>('');

  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId);
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
      
      <CommunicationPanel selectedContact={selectedContact} />
    </div>
  );
};

export default Index;
