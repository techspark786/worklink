const express = require('../backend/node_modules/express');

async function runEndToEndTests() {
  console.log('====================================================');
  console.log('SHRAMSETU END-TO-END SYSTEM INTEGRATION TEST SUITE');
  console.log('====================================================');

  const app = express();
  app.use(express.json());

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      app: 'ShramSetu Backend API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount backend compiled routes
  const authRoutes = require('../backend/dist/routes/authRoutes').default;
  const serviceRoutes = require('../backend/dist/routes/serviceRoutes').default;
  const workerRoutes = require('../backend/dist/routes/workerRoutes').default;
  const cooperativeRoutes = require('../backend/dist/routes/cooperativeRoutes').default;
  const bookingRoutes = require('../backend/dist/routes/bookingRoutes').default;
  const federationRoutes = require('../backend/dist/routes/federationRoutes').default;
  const complaintRoutes = require('../backend/dist/routes/complaintRoutes').complaintRouter;
  const reviewRoutes = require('../backend/dist/routes/reviewRoutes').reviewRouter;

  app.use('/api/auth', authRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/workers', workerRoutes);
  app.use('/api/cooperatives', cooperativeRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/federation', federationRoutes);
  app.use('/api/complaints', complaintRoutes);
  app.use('/api/reviews', reviewRoutes);

  const TEST_PORT = 5055;
  const server = app.listen(TEST_PORT);
  const BASE_URL = `http://localhost:${TEST_PORT}`;

  try {
    // 1. Health check
    console.log('\n[1] Testing Health Endpoint...');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    console.log(' [OK] Health Status:', healthData.status, '| App:', healthData.app);

    // 2. Services catalog
    console.log('\n[2] Testing Services Catalog...');
    const servicesRes = await fetch(`${BASE_URL}/api/services`);
    const servicesData = await servicesRes.json();
    console.log(` [OK] Retrieved ${servicesData.services.length} verified services`);

    // 3. Workers & FairMatch™ Matching Engine
    console.log('\n[3] Testing FairMatch™ Worker Matching Engine...');
    const matchRes = await fetch(`${BASE_URL}/api/workers/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: 26.8467,
        longitude: 80.9462,
        category: 'Electrical & Power',
        query: 'Ceiling fan repair',
        urgency: 'EMERGENCY_45_MIN',
      })
    });
    const matchData = await matchRes.json();
    console.log(` [OK] FairMatch returned ${matchData.totalFound} candidates`);
    const topWorker = matchData.workers[0];
    console.log(`   Top Candidate: ${topWorker.name} (${topWorker.cooperativeName})`);
    console.log(`   Distance: ${topWorker.distanceText} | FairMatch Score: ${topWorker.matchScore}%`);

    // 4. Create Booking
    console.log('\n[4] Testing Customer Booking Initiation & Pricing Breakdown...');
    const bookRes = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: 'cust-101',
        workerId: topWorker.id,
        workerName: topWorker.name,
        cooperativeName: topWorker.cooperativeName,
        serviceTitle: 'Ceiling Fan & Regulator Overhaul',
        serviceCategory: 'Electrical & Power',
        description: 'Ceiling fan sparking and buzzing loudly in bedroom.',
        urgency: 'EMERGENCY_45_MIN',
        customerLocation: {
          address: 'Flat 402, Hazratganj Heights',
          city: 'Lucknow',
          pincode: '226001',
        },
        baseWage: 400,
        matchScore: topWorker.matchScore,
      })
    });
    const bookData = await bookRes.json();
    const booking = bookData.booking;
    const bookingId = booking._id || booking.id;
    console.log(` [OK] Booking Created: Order #${bookingId}`);
    console.log(`   Base: INR ${booking.pricing.baseWage} | Welfare Cess: INR ${booking.pricing.welfareCess} | Total: INR ${booking.pricing.totalAmount}`);
    console.log(`   Security Tokens: Start OTP: [${booking.startOtp}] | Completion OTP: [${booking.completionOtp}]`);

    // 5. Worker Accepts Gig (ASSIGNED)
    console.log('\n[5] Testing Worker Accept Gig...');
    const acceptRes = await fetch(`${BASE_URL}/api/bookings/${bookingId}/accept`, { method: 'POST' });
    const acceptData = await acceptRes.json();
    console.log(` [OK] Status: ${acceptData.booking.status} (${acceptData.message})`);

    // 6. Worker Marks Arrival (ARRIVED)
    console.log('\n[6] Testing Worker Arrival at Doorstep...');
    const arriveRes = await fetch(`${BASE_URL}/api/bookings/${bookingId}/arrived`, { method: 'POST' });
    const arriveData = await arriveRes.json();
    console.log(` [OK] Status: ${arriveData.booking.status} (${arriveData.message})`);

    // 7. Verify Start OTP (IN_PROGRESS)
    console.log('\n[7] Testing Start OTP Doorstep Handshake...');
    const startOtpRes = await fetch(`${BASE_URL}/api/bookings/${bookingId}/verify-start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp: booking.startOtp })
    });
    const startOtpData = await startOtpRes.json();
    console.log(` [OK] Status: ${startOtpData.booking.status} (${startOtpData.message})`);

    // 8. Verify Completion OTP & Release Escrow (COMPLETED)
    console.log('\n[8] Testing Completion OTP & Payment Escrow Settlement...');
    const compOtpRes = await fetch(`${BASE_URL}/api/bookings/${bookingId}/verify-completion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp: booking.completionOtp })
    });
    const compOtpData = await compOtpRes.json();
    console.log(` [OK] Status: ${compOtpData.booking.status} (${compOtpData.message})`);

    // 9. Cooperative Welfare Fund Ledger Audit
    console.log('\n[9] Testing Cooperative Welfare Ledger & Social Security...');
    const welfareRes = await fetch(`${BASE_URL}/api/cooperatives/coop-1/welfare`);
    const welfareData = await welfareRes.json();
    console.log(` [OK] Cooperative: ${welfareData.cooperativeName}`);
    console.log(`   Welfare Pool Balance: INR ${welfareData.welfareFundBalance.toLocaleString()}`);
    console.log(`   Audited Transactions Count: ${welfareData.transactions.length}`);

    // 10. Federation Overview & Institutional Tenders
    console.log('\n[10] Testing State Federation & Institutional Contracts...');
    const fedRes = await fetch(`${BASE_URL}/api/federation/overview`);
    const fedData = await fedRes.json();
    const ov = fedData.overview;
    console.log(` [OK] Federation: ${ov.federationName}`);
    console.log(`   Total Workforce: ${ov.totalRegisteredWorkers} | Cumulative GMV: INR ${(ov.cumulativeGmv/100000).toFixed(1)} Lakh`);
    console.log(`   Solvency Ratio: ${ov.solvencyRatio} | Statutory Wage Compliance: ${ov.statutoryWageFloorCompliance}`);

    const contractsRes = await fetch(`${BASE_URL}/api/federation/contracts`);
    const contractsData = await contractsRes.json();
    console.log(` [OK] Institutional Bulk Contracts Active: ${contractsData.contracts.length}`);

    // 11. Customer Grievances & Cooperative Peer Arbitration
    console.log('\n[11] Testing Grievance Filing & Section 70 Peer Arbitration...');
    const compPostRes = await fetch(`${BASE_URL}/api/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId,
        customerName: 'Ananya Deshmukh',
        workerName: 'Ramesh Kumar',
        category: 'LATE_ARRIVAL',
        severity: 'MEDIUM',
        description: 'Technician reached 20 mins delayed due to road traffic.',
      })
    });
    const compPostText = await compPostRes.text();
    let compPostData;
    try {
      compPostData = JSON.parse(compPostText);
    } catch(e) {
      console.error('Status:', compPostRes.status, 'Response:', compPostText.substring(0, 300));
      throw e;
    }
    console.log(` [OK] Complaint Filed: ${compPostData.complaint.complaintId} (Status: ${compPostData.complaint.status})`);

    const compResolveRes = await fetch(`${BASE_URL}/api/complaints/${compPostData.complaint.complaintId}/resolve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'RESOLVED',
        arbitrationNotes: 'Traffic congestion verified by GPS audit. Goodwill voucher granted.',
        resolutionAction: '₹50 courtesy transit voucher credited.',
        refundAmount: 50,
      })
    });
    const compResolveData = await compResolveRes.json();
    console.log(` [OK] Arbitration Adjudication: ${compResolveData.complaint.status} (${compResolveData.complaint.resolutionAction})`);

    // 12. 5-Factor Verified Review & Reputation Engine
    console.log('\n[12] Testing 5-Factor Customer Review & Trust Scoring...');
    const reviewRes = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId,
        workerId: 'w-101',
        workerName: 'Ramesh Kumar',
        customerName: 'Ananya Deshmukh',
        overallRating: 5,
        skillRating: 5,
        behaviourRating: 5,
        punctualityRating: 4,
        serviceQualityRating: 5,
        comment: 'Outstanding electrical repair. Professional, honest cooperative member!',
      })
    });
    const reviewData = await reviewRes.json();
    console.log(` [OK] Review Logged: ${reviewData.review.reviewId} (Rating: ${reviewData.review.overallRating}/5, Verified: ${reviewData.review.isVerifiedBooking})`);

    console.log('\n====================================================');
    console.log('ALL 12 END-TO-END INTEGRATION TEST STAGES PASSED!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('[FAIL] E2E TEST FAILED:', err);
    process.exitCode = 1;
  } finally {
    server.close(() => {
      process.exit(process.exitCode || 0);
    });
  }
}

runEndToEndTests();
