import { EraData } from '../types';

const formatDate = (dateStr: string, century: boolean = false): string => {
  if (!/^\d{8}$/.test(dateStr)) return dateStr;
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return century ? `${year}${month}${day}` : `${year.substring(2)}${month}${day}`;
};

const generateControlNumber = (): string => Math.floor(100000000 + Math.random() * 900000000).toString();

export const generateEraString = (data: EraData): string => {
  const segments: string[] = [];
  const interchangeControlNumber = generateControlNumber();
  const transactionSetControlNumber = '0001'; // From example
  const currentDate = new Date();
  const currentDateStr = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}`;
  const time = currentDate.toTimeString().split(' ')[0].replace(/:/g, '');
  const paymentDate = data.payment.paymentDate || currentDateStr;

  // ISA Segment (based on valid example)
  segments.push(
    [
      'ISA', '00', ' '.repeat(10), '00', ' '.repeat(10),
      'ZZ', data.interchange.senderId.padEnd(15), 'ZZ', data.interchange.receiverId.padEnd(15),
      formatDate(currentDateStr), time.substring(0, 4), '^', '00501', interchangeControlNumber,
      '0', 'P', ':',
    ].join('*')
  );

  // GS Segment
  segments.push(
    [
      'GS', 'HP', data.interchange.senderId, data.interchange.receiverId,
      formatDate(currentDateStr, true), time.substring(0, 4), '1', // GS06 is group control number, example has '1'
      'X', '005010X221A1',
    ].join('*')
  );

  const stIndex = segments.length;
  // ST Segment
  segments.push(['ST', '835', transactionSetControlNumber].join('*'));

  // BPR Segment (from valid example)
  segments.push([
      'BPR', 'I', data.payment.amount, 'C', data.payment.method, 'CCP',
      '01', '011900445', 'DA', '0000009146', // These seem like routing/account numbers, can be static for testing
      data.payer.id, '', '01', '021205376', 'DA', '625422108', // More static test data
      formatDate(paymentDate, true)
  ].join('*'));

  // TRN Segment
  segments.push(['TRN', '1', data.payment.checkNumber, data.payer.id].join('*'));

  // REF*EV
  if(data.payment.receiverId) {
    segments.push(['REF', 'EV', data.payment.receiverId].join('*'));
  }
  
  // DTM*405 Production Date
  segments.push(['DTM', '405', formatDate(currentDateStr, true)].join('*'));

  // Payer Loop
  segments.push(['N1', 'PR', data.payer.name.toUpperCase()].join('*'));
  if (data.payer.address) segments.push(['N3', data.payer.address.toUpperCase()].join('*'));
  if (data.payer.city && data.payer.state && data.payer.zip) segments.push(['N4', data.payer.city.toUpperCase(), data.payer.state.toUpperCase(), data.payer.zip].join('*'));
  if (data.payer.secondaryId) segments.push(['REF', '2U', data.payer.secondaryId].join('*'));
  if (data.payer.billingContactName) segments.push(['PER', 'BL', data.payer.billingContactName.toUpperCase()].join('*'));
  if (data.payer.techContactName) segments.push(['PER', 'CX', data.payer.techContactName.toUpperCase(), 'TE', data.payer.techContactPhone].join('*'));

  // Payee Loop
  segments.push(['N1', 'PE', data.payee.name.toUpperCase(), 'XX', data.payee.npi].join('*'));
  if (data.payee.address) segments.push(['N3', data.payee.address.toUpperCase()].join('*'));
  if (data.payee.city && data.payee.state && data.payee.zip) segments.push(['N4', data.payee.city.toUpperCase(), data.payee.state.toUpperCase(), data.payee.zip].join('*'));
  if (data.payee.taxId) segments.push(['REF', 'TJ', data.payee.taxId].join('*'));

  data.claims.forEach((claim, index) => {
    // LX Segment
    segments.push(['LX', (index + 1).toString()].join('*'));

    // TS3 - Provider Summary Information (Optional, but in example)
    if (index === 0 && claim.facilityCode) {
        const totalCharge = data.claims.reduce((sum, c) => sum + parseFloat(c.totalClaimCharge || '0'), 0);
        segments.push(['TS3', data.payee.npi, claim.facilityCode, formatDate(paymentDate, true), data.claims.length.toString(), totalCharge.toFixed(2)].join('*'));
    }

    // CLP Segment
    segments.push(
      [
        'CLP', claim.patientControlNumber, claim.claimStatus,
        claim.totalClaimCharge, claim.claimPaymentAmount, claim.patientResponsibilityAmount,
        claim.claimFilingIndicator, claim.payerClaimControlNumber, claim.facilityCode, claim.frequencyCode
      ].join('*')
    );
    
    // Patient Name
    segments.push(
      ['NM1', 'QC', '1', claim.patientLastName.toUpperCase(), claim.patientFirstName.toUpperCase(), '', '', '', 'MI', claim.patientId].join('*')
    );
    
    // Rendering Provider
    if(claim.renderingProviderNPI) {
        segments.push(['NM1', '82', '1', claim.renderingProviderLastName.toUpperCase(), claim.renderingProviderFirstName.toUpperCase(), '', '', '', 'XX', claim.renderingProviderNPI].join('*'));
    }

    // Claim-level REFs
    if(claim.groupNumber) segments.push(['REF', '1L', claim.groupNumber].join('*'));
    if(claim.contractCode) segments.push(['REF', 'CE', claim.contractCode].join('*'));

    // Claim-level DTMs
    if(claim.statementStartDate) segments.push(['DTM', '232', formatDate(claim.statementStartDate, true)].join('*'));
    if(claim.statementEndDate) segments.push(['DTM', '233', formatDate(claim.statementEndDate, true)].join('*'));
    if(claim.receivedDate) segments.push(['DTM', '050', formatDate(claim.receivedDate, true)].join('*'));
    
    // Claim-level PER
    if(claim.contactPhoneNumber) segments.push(['PER', 'CX', '', 'TE', claim.contactPhoneNumber].join('*'));

    // Claim-level AMT
    if(claim.coverageAmount) segments.push(['AMT', 'AU', claim.coverageAmount].join('*'));

    // Claim-Level Adjustments, grouped by group code
    const claimAdjByGroup = (claim.adjustments || []).reduce((acc, adj) => {
        if (adj.groupCode && adj.reasonCode && adj.amount) {
            (acc[adj.groupCode] = acc[adj.groupCode] || []).push(adj);
        }
        return acc;
    }, {} as Record<string, typeof claim.adjustments>);

    Object.entries(claimAdjByGroup).forEach(([groupCode, adjs]) => {
        const casElements = ['CAS', groupCode];
        adjs.forEach(adj => casElements.push(adj.reasonCode, adj.amount));
        segments.push(casElements.join('*'));
    });

    claim.serviceLines.forEach((line) => {
        // SVC with composite procedure code
        const procedureComposite = ['HC', line.procedureCode];
        if (line.modifier1) procedureComposite.push(line.modifier1);
        if (line.modifier2) procedureComposite.push(line.modifier2);
        if (line.modifier3) procedureComposite.push(line.modifier3);
        if (line.modifier4) procedureComposite.push(line.modifier4);
        
        segments.push(
            ['SVC', procedureComposite.join(':'), line.submittedAmount, line.paidAmount, '', line.units].join('*')
        );
        
        // Service Line Date
        segments.push(['DTM', '472', formatDate(line.adjudicationDate, true)].join('*'));

        // Service-Line Adjustments, grouped by group code
        const lineAdjByGroup = (line.adjustments || []).reduce((acc, adj) => {
          if (adj.groupCode && adj.reasonCode && adj.amount) {
              (acc[adj.groupCode] = acc[adj.groupCode] || []).push(adj);
          }
          return acc;
        }, {} as Record<string, typeof line.adjustments>);
        Object.entries(lineAdjByGroup).forEach(([groupCode, adjs]) => {
            const casElements = ['CAS', groupCode];
            adjs.forEach(adj => casElements.push(adj.reasonCode, adj.amount));
            segments.push(casElements.join('*'));
        });

        // Service line REFs, AMTs, LQs
        if(line.lineItemControlNumber) segments.push(['REF', '6R', line.lineItemControlNumber].join('*'));
        if (line.allowedAmount && parseFloat(line.allowedAmount) > 0) {
            segments.push(['AMT', 'B6', line.allowedAmount].join('*'));
        }
        if (line.remarkCodes) {
            line.remarkCodes.split(',').forEach(code => {
                if(code.trim()) segments.push(['LQ', 'HE', code.trim()].join('*'));
            });
        }
    });
  });

  // SE Segment
  const transactionSegmentsCount = segments.length - stIndex + 1;
  segments.push(['SE', transactionSegmentsCount, transactionSetControlNumber].join('*'));

  // GE Segment
  segments.push(['GE', '1', '1'].join('*')); // GE02 is group control number, must match GS06

  // IEA Segment
  segments.push(['IEA', '1', interchangeControlNumber].join('*'));

  return segments.join('~\n') + '~';
};
