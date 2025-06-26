import React from 'react';
import { Claim, ServiceLine, Adjustment } from '../types';
import InputField from './InputField';
import Section from './Section';

interface HandleChangeFunc {
  (path: string, value: string): void;
}

interface AdjustmentFormProps {
  adjustment: Adjustment;
  pathPrefix: string;
  handleInputChange: HandleChangeFunc;
  onRemove: () => void;
}

const AdjustmentForm: React.FC<AdjustmentFormProps> = ({ adjustment, pathPrefix, handleInputChange, onRemove }) => {
  return (
    <div className="flex items-end gap-2 p-3 bg-gray-600/50 rounded-lg">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
        <InputField label="Group Code" id={`${pathPrefix}.groupCode`} value={adjustment.groupCode} onChange={e => handleInputChange(`${pathPrefix}.groupCode`, e.target.value)} />
        <InputField label="Reason Code" id={`${pathPrefix}.reasonCode`} value={adjustment.reasonCode} onChange={e => handleInputChange(`${pathPrefix}.reasonCode`, e.target.value)} />
        <InputField label="Amount ($)" id={`${pathPrefix}.amount`} value={adjustment.amount} onChange={e => handleInputChange(`${pathPrefix}.amount`, e.target.value)} />
      </div>
      <button onClick={onRemove} className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-md transition-colors h-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

interface ServiceLineFormProps {
  serviceLine: ServiceLine;
  claimIndex: number;
  serviceLineIndex: number;
  handleInputChange: HandleChangeFunc;
  onRemoveServiceLine: () => void;
  onAddAdjustment: () => void;
  onRemoveAdjustment: (adjustmentIndex: number) => void;
}

const ServiceLineForm: React.FC<ServiceLineFormProps> = ({ serviceLine, claimIndex, serviceLineIndex, handleInputChange, onRemoveServiceLine, onAddAdjustment, onRemoveAdjustment }) => {
  const pathPrefix = `claims[${claimIndex}].serviceLines[${serviceLineIndex}]`;
  const genericHandler = (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.name, e.target.value);


  return (
    <div className="bg-gray-700 rounded-lg mb-4 border border-gray-600">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
            <h4 className="text-base font-semibold text-indigo-300">Service Line {serviceLineIndex + 1}</h4>
            <button onClick={onRemoveServiceLine} className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-3">
            <InputField label="Procedure Code" id={`${pathPrefix}.procedureCode`} value={serviceLine.procedureCode} onChange={genericHandler} />
            <InputField label="Submitted Amount ($)" id={`${pathPrefix}.submittedAmount`} value={serviceLine.submittedAmount} onChange={genericHandler} />
            <InputField label="Allowed Amount ($)" id={`${pathPrefix}.allowedAmount`} value={serviceLine.allowedAmount} onChange={genericHandler} />
            <InputField label="Paid Amount ($)" id={`${pathPrefix}.paidAmount`} value={serviceLine.paidAmount} onChange={genericHandler} />
            <InputField label="Adjudication Date (YYYYMMDD)" id={`${pathPrefix}.adjudicationDate`} value={serviceLine.adjudicationDate} onChange={genericHandler} />
            <InputField label="Units" id={`${pathPrefix}.units`} value={serviceLine.units} onChange={genericHandler} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <InputField label="Modifier 1" id={`${pathPrefix}.modifier1`} value={serviceLine.modifier1} onChange={genericHandler} />
            <InputField label="Modifier 2" id={`${pathPrefix}.modifier2`} value={serviceLine.modifier2} onChange={genericHandler} />
            <InputField label="Modifier 3" id={`${pathPrefix}.modifier3`} value={serviceLine.modifier3} onChange={genericHandler} />
            <InputField label="Modifier 4" id={`${pathPrefix}.modifier4`} value={serviceLine.modifier4} onChange={genericHandler} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Line Item Control # (REF*6R)" id={`${pathPrefix}.lineItemControlNumber`} value={serviceLine.lineItemControlNumber} onChange={genericHandler} />
            <InputField label="Remark Codes (LQ*HE, comma-sep)" id={`${pathPrefix}.remarkCodes`} value={serviceLine.remarkCodes} onChange={genericHandler} placeholder="e.g. N669,N123" />
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <h5 className="text-sm font-semibold text-gray-300 mb-2 mt-2">Service Line Adjustments</h5>
        <div className="ml-4 md:ml-8 space-y-3">
            {serviceLine.adjustments.map((adj, adjIndex) => (
            <AdjustmentForm
                key={adj.id}
                adjustment={adj}
                pathPrefix={`${pathPrefix}.adjustments[${adjIndex}]`}
                handleInputChange={handleInputChange}
                onRemove={() => onRemoveAdjustment(adjIndex)}
            />
            ))}
            <div className="mt-2">
            <button onClick={onAddAdjustment} className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-1 px-3 rounded-md transition-colors">
                + Add Service Adjustment
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}

interface ClaimFormProps {
  claim: Claim;
  index: number;
  handleInputChange: HandleChangeFunc;
  onRemoveClaim: () => void;
  onAddServiceLine: (claimIndex: number) => void;
  onRemoveServiceLine: (claimIndex: number, serviceLineIndex: number) => void;
  onAddAdjustment: (claimIndex: number, serviceLineIndex: number) => void;
  onRemoveAdjustment: (claimIndex: number, serviceLineIndex: number, adjustmentIndex: number) => void;
  onAddClaimAdjustment: (claimIndex: number) => void;
  onRemoveClaimAdjustment: (claimIndex: number, adjustmentIndex: number) => void;
}

const ClaimForm: React.FC<ClaimFormProps> = ({ claim, index, handleInputChange, onRemoveClaim, onAddServiceLine, onRemoveServiceLine, onAddAdjustment, onRemoveAdjustment, onAddClaimAdjustment, onRemoveClaimAdjustment }) => {
  const pathPrefix = `claims[${index}]`;
  const genericHandler = (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.name, e.target.value);


  const claimTitle = (
    <div className="flex justify-between items-center w-full">
      <span className="truncate pr-4">{`Claim ${index + 1}: ${claim.patientLastName}, ${claim.patientFirstName} (${claim.patientControlNumber})`}</span>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent the section from toggling open/closed
          onRemoveClaim();
        }}
        className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-full transition-colors ml-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
        aria-label={`Remove Claim for ${claim.patientLastName}, ${claim.patientFirstName}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );

  return (
    <Section title={claimTitle} defaultOpen={true}>
      <div className="space-y-6">
        {/* Claim Level Details */}
        <div>
          <h3 className="text-md font-semibold text-gray-200 mb-2 border-b border-gray-600 pb-2">Claim & Patient Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <InputField label="Patient Control Number" id={`${pathPrefix}.patientControlNumber`} value={claim.patientControlNumber} onChange={genericHandler} />
            <InputField label="Payer Claim Control Number" id={`${pathPrefix}.payerClaimControlNumber`} value={claim.payerClaimControlNumber} onChange={genericHandler} />
            <InputField label="Total Charge ($)" id={`${pathPrefix}.totalClaimCharge`} value={claim.totalClaimCharge} onChange={genericHandler} />
            <InputField label="Payment Amount ($)" id={`${pathPrefix}.claimPaymentAmount`} value={claim.claimPaymentAmount} onChange={genericHandler} />
            <InputField label="Patient Responsibility ($)" id={`${pathPrefix}.patientResponsibilityAmount`} value={claim.patientResponsibilityAmount} onChange={genericHandler} />
            <InputField label="Patient First Name" id={`${pathPrefix}.patientFirstName`} value={claim.patientFirstName} onChange={genericHandler} />
            <InputField label="Patient Last Name" id={`${pathPrefix}.patientLastName`} value={claim.patientLastName} onChange={genericHandler} />
            <InputField label="Patient ID" id={`${pathPrefix}.patientId`} value={claim.patientId} onChange={genericHandler} />
          </div>
        </div>
        
        {/* Provider & Contract Details */}
        <div>
            <h3 className="text-md font-semibold text-gray-200 mb-2 border-b border-gray-600 pb-2">Provider & Contract Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <InputField label="Rendering Provider Last Name" id={`${pathPrefix}.renderingProviderLastName`} value={claim.renderingProviderLastName} onChange={genericHandler} />
              <InputField label="Rendering Provider First Name" id={`${pathPrefix}.renderingProviderFirstName`} value={claim.renderingProviderFirstName} onChange={genericHandler} />
              <InputField label="Rendering Provider NPI" id={`${pathPrefix}.renderingProviderNPI`} value={claim.renderingProviderNPI} onChange={genericHandler} />
              <InputField label="Group Number (REF*1L)" id={`${pathPrefix}.groupNumber`} value={claim.groupNumber} onChange={genericHandler} />
              <InputField label="Contract Code (REF*CE)" id={`${pathPrefix}.contractCode`} value={claim.contractCode} onChange={genericHandler} />
            </div>
        </div>

        {/* Claim Dates & Codes */}
         <div>
            <h3 className="text-md font-semibold text-gray-200 mb-2 border-b border-gray-600 pb-2">Claim Dates & Codes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <InputField label="Statement Start Date" id={`${pathPrefix}.statementStartDate`} value={claim.statementStartDate} onChange={genericHandler} placeholder="YYYYMMDD"/>
                <InputField label="Statement End Date" id={`${pathPrefix}.statementEndDate`} value={claim.statementEndDate} onChange={genericHandler} placeholder="YYYYMMDD"/>
                <InputField label="Received Date" id={`${pathPrefix}.receivedDate`} value={claim.receivedDate} onChange={genericHandler} placeholder="YYYYMMDD"/>
                <InputField label="Contact Phone" id={`${pathPrefix}.contactPhoneNumber`} value={claim.contactPhoneNumber} onChange={genericHandler} />
                <InputField label="Claim Status Code" id={`${pathPrefix}.claimStatus`} value={claim.claimStatus} onChange={genericHandler} placeholder="e.g., 1"/>
                <InputField label="Filing Indicator Code" id={`${pathPrefix}.claimFilingIndicator`} value={claim.claimFilingIndicator} onChange={genericHandler} placeholder="e.g., 12"/>
                <InputField label="Facility Code" id={`${pathPrefix}.facilityCode`} value={claim.facilityCode} onChange={genericHandler} placeholder="e.g., 11"/>
                <InputField label="Frequency Code" id={`${pathPrefix}.frequencyCode`} value={claim.frequencyCode} onChange={genericHandler} placeholder="e.g., 1"/>
                <InputField label="Coverage Amount ($)" id={`${pathPrefix}.coverageAmount`} value={claim.coverageAmount} onChange={genericHandler} />
            </div>
        </div>

        {/* Claim Adjustments Section */}
        <div>
            <h3 className="text-md font-semibold text-gray-200 mb-2 border-b border-gray-600 pb-2">Claim Level Adjustments</h3>
            <div className="space-y-3 mt-4">
                {claim.adjustments.map((adj, adjIndex) => (
                    <AdjustmentForm
                        key={adj.id}
                        adjustment={adj}
                        pathPrefix={`${pathPrefix}.adjustments[${adjIndex}]`}
                        handleInputChange={handleInputChange}
                        onRemove={() => onRemoveClaimAdjustment(index, adjIndex)}
                    />
                ))}
                <div className="mt-2">
                    <button onClick={() => onAddClaimAdjustment(index)} className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-1 px-3 rounded-md transition-colors">
                        + Add Claim Adjustment
                    </button>
                </div>
            </div>
        </div>

        {/* Service Lines Section */}
        <div>
            <h3 className="text-md font-semibold text-gray-200 mb-2 border-b border-gray-600 pb-2">Service Lines</h3>
            <div className="space-y-4 mt-4">
            {claim.serviceLines.map((sl, slIndex) => (
                <ServiceLineForm 
                    key={sl.id}
                    serviceLine={sl}
                    claimIndex={index}
                    serviceLineIndex={slIndex}
                    handleInputChange={handleInputChange}
                    onRemoveServiceLine={() => onRemoveServiceLine(index, slIndex)}
                    onAddAdjustment={() => onAddAdjustment(index, slIndex)}
                    onRemoveAdjustment={(adjIndex) => onRemoveAdjustment(index, slIndex, adjIndex)}
                />
            ))}
            </div>
            <div className="mt-4">
              <button onClick={() => onAddServiceLine(index)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full md:w-auto">
                + Add Service Line to Claim
              </button>
            </div>
        </div>
      </div>
    </Section>
  );
};

export default ClaimForm;