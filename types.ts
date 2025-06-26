export interface Adjustment {
  id: string;
  groupCode: string;
  reasonCode: string;
  amount: string;
}

export interface ServiceLine {
  id: string;
  procedureCode: string;
  modifier1: string;
  modifier2: string;
  modifier3: string;
  modifier4: string;
  submittedAmount: string;
  paidAmount: string;
  allowedAmount: string;
  adjudicationDate: string; // DTM*472
  adjustments: Adjustment[];
  // New fields from valid ERA example
  units: string; // SVC05
  lineItemControlNumber: string; // REF*6R
  remarkCodes: string; // LQ*HE (comma-separated)
}

export interface Claim {
  id:string;
  patientControlNumber: string;
  claimStatus: string;
  totalClaimCharge: string;
  claimPaymentAmount: string;
  patientResponsibilityAmount: string;
  claimFilingIndicator: string;
  payerClaimControlNumber: string;
  patientFirstName: string;
  patientLastName: string;
  patientId: string;
  adjustments: Adjustment[];
  serviceLines: ServiceLine[];
  // New fields from valid ERA example
  facilityCode: string; // CLP08
  frequencyCode: string; // CLP09
  renderingProviderLastName: string; // NM1*82
  renderingProviderFirstName: string; // NM1*82
  renderingProviderNPI: string; // NM1*82
  groupNumber: string; // REF*1L
  contractCode: string; // REF*CE
  statementStartDate: string; // DTM*232
  statementEndDate: string; // DTM*233
  receivedDate: string; // DTM*050
  contactPhoneNumber: string; // PER*CX
  coverageAmount: string; // AMT*AU
}

export interface EraData {
  interchange: {
    senderId: string;
    receiverId: string;
  };
  payer: {
    name: string;
    id: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    // New Payer fields
    billingContactName: string; // PER*BL
    techContactName: string; // PER*CX
    techContactPhone: string; // PER*CX
    secondaryId: string; // REF*2U
  };
  payee: {
    name: string;
    npi: string;
    taxId: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  payment: {
    method: string;
    amount: string;
    checkNumber: string;
    paymentDate: string;
    receiverId: string; // REF*EV
  };
  claims: Claim[];
}