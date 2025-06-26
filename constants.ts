import { EraData } from './types';

export const DEFAULT_ERA_DATA: EraData = {
  interchange: {
    senderId: '60054',
    receiverId: '17131',
  },
  payer: {
    name: 'AETNA',
    id: '1066033492', // From TRN segment
    address: '151 FARMINGTON AVENUE',
    city: 'HARTFORD',
    state: 'CT',
    zip: '06156',
    billingContactName: 'PROVIDER SERVICE',
    techContactName: 'UNSPECIFIED',
    techContactPhone: '0000000000', // From PER*CX
    secondaryId: 'AETNA' // From REF*2U
  },
  payee: {
    name: 'INTEGRATIVE ACUPUNCTURE CENTER',
    npi: '1952479487',
    taxId: '721574569', // From REF*TJ
    address: '69 W RIDGEWOOD AVE',
    city: 'RIDGEWOOD',
    state: 'NJ',
    zip: '07450',
  },
  payment: {
    method: 'ACH',
    amount: '99.11',
    checkNumber: '882407301078256', // From TRN segment
    paymentDate: '20240319', // From BPR segment
    receiverId: '030240928' // From REF*EV
  },
  claims: [
    {
      id: 'claim_1',
      patientControlNumber: 'V391',
      claimStatus: '1', // Processed as primary
      totalClaimCharge: '480',
      claimPaymentAmount: '99.11',
      patientResponsibilityAmount: '10',
      claimFilingIndicator: '12', // PPO
      payerClaimControlNumber: 'E7369ZQKW0000',
      facilityCode: '11',
      frequencyCode: '1',
      patientFirstName: 'TERESA',
      patientLastName: 'ISIK',
      patientId: '101262932500',
      renderingProviderLastName: 'GOLDSTEIN',
      renderingProviderFirstName: 'JOSHUA',
      renderingProviderNPI: '1952479487',
      groupNumber: '100024-02EG0029',
      contractCode: 'ESA - MEDICARE MA (AETNA)',
      statementStartDate: '20240311',
      statementEndDate: '20240311',
      receivedDate: '20240312',
      contactPhoneNumber: '8886323862',
      coverageAmount: '480',
      adjustments: [
        { id: 'cadj_1', groupCode: 'PR', reasonCode: '3', amount: '10'}
      ],
      serviceLines: [
        {
          id: 'sl_1',
          procedureCode: '97811',
          modifier1: '',
          modifier2: '',
          modifier3: '',
          modifier4: '',
          submittedAmount: '240',
          paidAmount: '50.39',
          allowedAmount: '61.42',
          adjudicationDate: '20240311',
          units: '2',
          lineItemControlNumber: 'V687C1269I1',
          remarkCodes: 'N669',
          adjustments: [
            { id: 'sadj_1_1', groupCode: 'CO', reasonCode: '253', amount: '1.03'},
            { id: 'sadj_1_2', groupCode: 'CO', reasonCode: '45', amount: '178.58'}
          ],
        },
        {
          id: 'sl_2',
          procedureCode: '97813',
          modifier1: '',
          modifier2: '',
          modifier3: '',
          modifier4: '',
          submittedAmount: '240',
          paidAmount: '48.72',
          allowedAmount: '49.71',
          adjudicationDate: '20240311',
          units: '1',
          lineItemControlNumber: 'V687C1268I2',
          remarkCodes: 'N669',
          adjustments: [
            { id: 'sadj_2_1', groupCode: 'CO', reasonCode: '253', amount: '.99'},
            { id: 'sadj_2_2', groupCode: 'CO', reasonCode: '45', amount: '190.29'}
          ],
        }
      ]
    }
  ]
};
