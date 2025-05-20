
import React from 'react';

interface StatusWorkflowProps {
  currentStatus: string;
}

const StatusWorkflow: React.FC<StatusWorkflowProps> = ({ currentStatus }) => {
  const statuses = ['Nieuw', 'In behandeling', 'Geëscaleerd', 'Gesloten'];
  
  return (
    <div className="status-workflow my-4">
      {statuses.map(status => (
        <div 
          key={status} 
          className={`status-workflow-item ${currentStatus === status ? 'active' : ''}`}
        >
          {status}
        </div>
      ))}
    </div>
  );
};

export default StatusWorkflow;
