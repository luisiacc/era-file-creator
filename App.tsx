import React, { useState } from 'react';
import { EraData } from './types';
import { DEFAULT_ERA_DATA } from './constants';
import { generateEraString } from './services/eraGenerator';
import Header from './components/Header';
import Section from './components/Section';
import InputField from './components/InputField';
import ClaimForm from './components/ClaimForm';

const App: React.FC = () => {
  const [eraData, setEraData] = useState<EraData>(DEFAULT_ERA_DATA);
  const today = new Date();
  const formattedDate = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

  const handleInputChange = (path: string, value: string) => {
    setEraData(prevData => {
      const keys = path.split(/[.\[\]]+/).filter(Boolean); // Handles nested paths like 'claims[0].serviceLines[1]'
      const newData = JSON.parse(JSON.stringify(prevData));
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (current[key] === undefined) {
          // If a key doesn't exist, we can't continue.
          return prevData;
        }
        current = current[key];
      }
      
      const lastKey = keys[keys.length - 1];
      if (current) {
         current[lastKey] = value;
      }

      return newData;
    });
  };
  
  const handleAddClaim = () => {
    setEraData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const nextClaimIndex = newData.claims.length;
      newData.claims.push({
        id: `claim_${Date.now()}`,
        patientControlNumber: `PATCTRL${String(nextClaimIndex + 1).padStart(3, '0')}`,
        claimStatus: '1',
        totalClaimCharge: '0.00',
        claimPaymentAmount: '0.00',
        patientResponsibilityAmount: '0.00',
        claimFilingIndicator: 'CI',
        payerClaimControlNumber: `PAYERCLAIM${String(nextClaimIndex + 1).padStart(3, '0')}`,
        patientFirstName: 'New',
        patientLastName: 'Patient',
        patientId: `NEW${String(nextClaimIndex + 1).padStart(3, '0')}`,
        adjustments: [],
        serviceLines: [],
        facilityCode: '11',
        frequencyCode: '1',
        renderingProviderLastName: 'Provider',
        renderingProviderFirstName: 'Render',
        renderingProviderNPI: '1234567890',
        groupNumber: '',
        contractCode: '',
        statementStartDate: formattedDate,
        statementEndDate: formattedDate,
        receivedDate: formattedDate,
        contactPhoneNumber: '',
        coverageAmount: '0.00',
      });
      return newData;
    });
  };

  const handleRemoveClaim = (claimIndex: number) => {
      setEraData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        newData.claims.splice(claimIndex, 1);
        return newData;
      });
  };

  const handleAddServiceLine = (claimIndex: number) => {
    setEraData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.claims[claimIndex].serviceLines.push({
        id: `sl_${Date.now()}`,
        procedureCode: '99203',
        modifier1: '',
        modifier2: '',
        modifier3: '',
        modifier4: '',
        submittedAmount: '0.00',
        paidAmount: '0.00',
        allowedAmount: '0.00',
        adjudicationDate: formattedDate,
        adjustments: [],
        units: '1',
        lineItemControlNumber: `LNI-${Date.now()}`,
        remarkCodes: '',
      });
      return newData;
    });
  };

  const handleRemoveServiceLine = (claimIndex: number, serviceLineIndex: number) => {
    setEraData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.claims[claimIndex].serviceLines.splice(serviceLineIndex, 1);
      return newData;
    });
  };
  
  const handleAddAdjustment = (claimIndex: number, serviceLineIndex: number) => {
    setEraData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.claims[claimIndex].serviceLines[serviceLineIndex].adjustments.push({
        id: `adj_${Date.now()}`,
        groupCode: 'CO', // Contractual Obligation
        reasonCode: '45', // Charge exceeds fee schedule
        amount: '0.00'
      });
      return newData;
    });
  };
  
  const handleRemoveAdjustment = (claimIndex: number, serviceLineIndex: number, adjustmentIndex: number) => {
    setEraData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.claims[claimIndex].serviceLines[serviceLineIndex].adjustments.splice(adjustmentIndex, 1);
      return newData;
    });
  };

  const handleAddClaimAdjustment = (claimIndex: number) => {
    setEraData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        newData.claims[claimIndex].adjustments.push({
            id: `cadj_${Date.now()}`,
            groupCode: 'PR', // Patient Responsibility
            reasonCode: '1', // Deductible
            amount: '0.00'
        });
        return newData;
    });
  };
  
  const handleRemoveClaimAdjustment = (claimIndex: number, adjustmentIndex: number) => {
    setEraData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        newData.claims[claimIndex].adjustments.splice(adjustmentIndex, 1);
        return newData;
    });
  };

  const handleDownload = () => {
    try {
      const eraContent = generateEraString(eraData);
      const blob = new Blob([eraContent], { type: 'application/EDI;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ERA835_${eraData.payment.paymentDate}_${eraData.payment.checkNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to generate or download file:", error);
        alert("An error occurred while generating the file. Check the console for details.");
    }
  };

  const genericHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e.target.name, e.target.value);
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <Section title="Interchange & Payment Details" defaultOpen={true}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField label="Interchange Sender ID" id="interchange.senderId" value={eraData.interchange.senderId} onChange={genericHandler} />
            <InputField label="Interchange Receiver ID" id="interchange.receiverId" value={eraData.interchange.receiverId} onChange={genericHandler} />
            <InputField label="Payment Method (e.g., ACH)" id="payment.method" value={eraData.payment.method} onChange={genericHandler} />
            <InputField label="Total Payment Amount ($)" id="payment.amount" value={eraData.payment.amount} onChange={genericHandler} />
            <InputField label="Check / Trace Number" id="payment.checkNumber" value={eraData.payment.checkNumber} onChange={genericHandler} />
            <InputField label="Payment Date (YYYYMMDD)" id="payment.paymentDate" value={eraData.payment.paymentDate} onChange={genericHandler} />
            <InputField label="Receiver ID (REF*EV)" id="payment.receiverId" value={eraData.payment.receiverId} onChange={genericHandler} />
          </div>
        </Section>

        <Section title="Payer & Payee Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-indigo-300">Payer Details</h3>
              <InputField label="Payer Name" id="payer.name" value={eraData.payer.name} onChange={genericHandler} />
              <InputField label="Payer ID (TRN/BPR)" id="payer.id" value={eraData.payer.id} onChange={genericHandler} />
              <InputField label="Payer Secondary ID (REF*2U)" id="payer.secondaryId" value={eraData.payer.secondaryId} onChange={genericHandler} />
              <InputField label="Payer Address" id="payer.address" value={eraData.payer.address} onChange={genericHandler} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputField label="City" id="payer.city" value={eraData.payer.city} onChange={genericHandler} />
                <InputField label="State" id="payer.state" value={eraData.payer.state} onChange={genericHandler} />
                <InputField label="Zip Code" id="payer.zip" value={eraData.payer.zip} onChange={genericHandler} />
              </div>
              <h4 className="text-base font-medium text-indigo-400 mt-4 pt-2 border-t border-gray-700">Payer Contacts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Billing Contact Name" id="payer.billingContactName" value={eraData.payer.billingContactName} onChange={genericHandler} />
                <InputField label="Technical Contact Name" id="payer.techContactName" value={eraData.payer.techContactName} onChange={genericHandler} />
                <InputField label="Technical Contact Phone" id="payer.techContactPhone" value={eraData.payer.techContactPhone} onChange={genericHandler} className="col-span-full sm:col-span-2"/>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-indigo-300">Payee Details</h3>
              <InputField label="Payee Name" id="payee.name" value={eraData.payee.name} onChange={genericHandler} />
              <InputField label="Payee NPI" id="payee.npi" value={eraData.payee.npi} onChange={genericHandler} />
              <InputField label="Payee Tax ID" id="payee.taxId" value={eraData.payee.taxId} onChange={genericHandler} />
              <InputField label="Payee Address" id="payee.address" value={eraData.payee.address} onChange={genericHandler} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputField label="City" id="payee.city" value={eraData.payee.city} onChange={genericHandler} />
                <InputField label="State" id="payee.state" value={eraData.payee.state} onChange={genericHandler} />
                <InputField label="Zip Code" id="payee.zip" value={eraData.payee.zip} onChange={genericHandler} />
              </div>
            </div>
          </div>
        </section>
        
        {eraData.claims.map((claim, index) => (
          <ClaimForm 
            key={claim.id} 
            claim={claim} 
            index={index} 
            handleInputChange={handleInputChange}
            onRemoveClaim={() => handleRemoveClaim(index)}
            onAddServiceLine={handleAddServiceLine}
            onRemoveServiceLine={handleRemoveServiceLine}
            onAddAdjustment={handleAddAdjustment}
            onRemoveAdjustment={handleRemoveAdjustment}
            onAddClaimAdjustment={handleAddClaimAdjustment}
            onRemoveClaimAdjustment={handleRemoveClaimAdjustment}
          />
        ))}

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <button
                onClick={handleAddClaim}
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 order-2 md:order-1"
            >
                + Add New Claim
            </button>
            <button
                onClick={handleDownload}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 order-1 md:order-2"
            >
                Generate & Download ERA File
            </button>
        </div>
      </main>
    </div>
  );
};

export default App;
